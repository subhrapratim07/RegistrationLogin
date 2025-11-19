import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import jsPDF from "jspdf";
import * as QRCode from "qrcode";
import "react-toastify/dist/ReactToastify.css";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Nav from "./Nav";
import Footer from "./Footer";

// Import Leaflet marker images
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

// Define custom default icon
const defaultIcon = new L.Icon({
  iconUrl: iconUrl,
  iconRetinaUrl: iconRetinaUrl,
  shadowUrl: shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Helper function to Promisify Geolocation
const getGeolocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      // Added a timeout to prevent indefinite waiting on slow mobile networks
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 10000 }); 
    } else {
      reject(new Error("Geolocation not supported"));
    }
  });
};

const LocationPicker = ({ position, setPosition, setFormData }) => {
  useMapEvents({
    click(e) {
      const lat = e.latlng.lat;
      const lng = e.latlng.lng;
      setPosition([lat, lng]);

      // Fetch reverse geocode on click
      axios
        .get(`https://nominatim.openstreetmap.org/reverse`, {
          params: { lat, lon: lng, format: "json" },
        })
        .then((res) => {
          setFormData((prev) => ({
            ...prev,
            address: res.data.display_name || "",
            pincode: res.data.address?.postcode || prev.pincode,
          }));
        })
        .catch(() => {});
    },
  });

  return position ? <Marker position={position} icon={defaultIcon}></Marker> : null;
};


const Order = () => {
  const navigate = useNavigate();
  const [menuItems, setMenuItems] = useState([]);
  const [cart, setCart] = useState([]);
  const [step, setStep] = useState(1);
  const [position, setPosition] = useState(null);

  // *** FIX APPLIED HERE: Changed date format to ISO standard (YYYY-MM-DD) ***
  const [formData, setFormData] = useState({
    orderid: "",
    orderDate: new Date().toISOString().split('T')[0], // FIX: Use YYYY-MM-DD format
    name: "",
    address: "",
    pincode: "",
    items: [],
    paymentMethod: "Cash on Delivery",
    deliveryperson: "",
  });
  // *************************************************************************

  // Fetch menu items
  useEffect(() => {
    axios
      .get("https://cravory-erq6.onrender.com/items")
      .then((res) => setMenuItems(res.data))
      .catch(() => toast.error("Failed to load menu items"));
  }, []);

  // Fetch user name automatically
  useEffect(() => {
    const userEmail = localStorage.getItem("userEmail");
    if (userEmail) {
      axios
        .get(`https://cravory-erq6.onrender.com/users/${userEmail}`)
        .then((res) => {
          setFormData((prev) => ({ ...prev, name: res.data.name }));
        })
        .catch(() => toast.error("Failed to fetch user name"));
    }
  }, []);

  // Cart helpers
  const addToCart = (item, qty) => {
    if (!qty || qty < 1) return;
    setCart((prev) => {
      const exists = prev.find((p) => p.itemid === item.itemid);
      if (exists) {
        return prev.map((p) =>
          p.itemid === item.itemid ? { ...p, quantity: p.quantity + qty } : p
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeFromCart = (id) => {
    setCart((prev) => prev.filter((item) => item.itemid !== id));
  };

  const updateQuantity = (id, qty) => {
    if (qty < 1) return;
    setCart((prev) =>
      prev.map((item) =>
        item.itemid === id ? { ...item, quantity: qty } : item
      )
    );
  };

  const getTotal = () =>
    cart.reduce((acc, item) => acc + Number(item.price) * Number(item.quantity), 0);

  // *** handleCheckout remains async (Fixed in previous steps) ***
  const handleCheckout = async () => {
    if (cart.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const userEmail = localStorage.getItem("userEmail");
    if (!userEmail) {
      navigate("/login");
      return;
    }

    try {
      // 1. Get next Order ID
      const orderIdRes = await axios.get("https://cravory-erq6.onrender.com/next-order-id");
      
      // 2. Set initial form data (Order ID and items)
      setFormData((prev) => ({
        ...prev,
        orderid: orderIdRes.data.nextOrderId,
        items: cart.map((c) => ({ item: c.itemname, quantity: c.quantity })),
      }));
      
      // 3. ATTEMPT to get Geolocation
      try {
        const pos = await getGeolocation(); // <--- WAIT HERE for location
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setPosition([lat, lng]);

        // 4. Reverse Geocode
        const geoRes = await axios.get(`https://nominatim.openstreetmap.org/reverse`, {
          params: { lat, lon: lng, format: "json" },
        });
        
        // 5. Update form data with Geocoded address/pincode
        setFormData((prev) => ({
          ...prev,
          address: geoRes.data.display_name || prev.address,
          pincode: geoRes.data.address?.postcode || prev.pincode,
        }));
        
      } catch (e) {
        // If location fails (denied, timeout, not supported), proceed anyway.
        toast.warn("Location could not be auto-detected. Please enter the delivery address.");
      }
      
      // 6. Move to Step 2 ONLY after all preparations are done
      setStep(2);

    } catch (error) {
      console.error("Checkout prep error:", error);
      toast.error("Failed to prepare checkout. Please try again.");
    }
  };
  // *************************************************************************

  const handlePaymentSubmit = async () => {
    if (!formData.name.trim()) {
 
      toast.error("Please enter your name");
      return;
    }
    if (!formData.address.trim()) {
      toast.error("Please enter your address");
      return;
    }
    if (!/^\d{6}$/.test(formData.pincode)) {
      toast.error("Pincode must be exactly 6 digits");
      return;
    }

    const orderData = { ...formData };

    try {
      const res = await axios.post("https://cravory-erq6.onrender.com/place-order", orderData);
      toast.success(res?.data?.message || "Order placed successfully");

      const receiptData = { ...orderData, orderid: res?.data?.orderid || orderData.orderid };

      // Auto-download receipt
      await downloadReceipt(receiptData);

      // Reset cart & form (keep user name)
      setCart([]);
      setStep(1);
      setFormData((prev) => ({
        ...prev,
        name: prev.name,
        address: "",
        pincode: "",
        items: [],
      }));
    } catch (error) {
      console.error("Order submission failed:", error);
      toast.error("Order failed. Please check your network connection.");
    }
  };

  const downloadReceipt = async (receiptData) => {
    // ... (Your existing downloadReceipt function)
    const docHeight = 110 + receiptData.items.length * 10 + 40;
    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: [80, docHeight] });

    const logoImg = new Image();
    logoImg.src = "/logo.png";
    await new Promise((resolve) => { logoImg.onload = resolve; });

    doc.addImage(logoImg, "PNG", 30, 1, 20, 20);
    let y = 20;
    doc.setFont("courier", "bold");
    doc.setFontSize(12);
    doc.text("CRAVORY RESTAURANT", 40, y, { align: "center" });
    y += 10;

    doc.setFontSize(10);
    doc.setFont("courier", "normal");
    doc.text(`Order No: ${receiptData.orderid}`, 5, y);
    y += 5;
    
    // NOTE: If you need D/M/Y format on the PDF, you'll need to reformat here.
    // Otherwise, it will print the YYYY-MM-DD format.
    doc.text(`Date: ${receiptData.orderDate}`, 5, y);
    y += 5;
    
    doc.text(`Name: ${receiptData.name}`, 5, y);
    y += 5;

    const addressLines = doc.splitTextToSize(receiptData.address, 60);
    doc.text("Address:", 5, y);
    addressLines.forEach((line) => {
      doc.text(line, 23, y);
      y += 5;
    });

    doc.text(`Pincode: ${receiptData.pincode}`, 5, y);
    y += 7;

    doc.setFont("courier", "bold");
    doc.text("Item          Qty  Price  Total", 5, y);
    doc.setFont("courier", "normal");
    y += 4;

    let grandTotal = 0;
    for (const itemObj of receiptData.items) {
      const matched = menuItems.find((m) => m.itemname === itemObj.item);
      const price = matched ? parseFloat(matched.price) : 0;
      const qty = parseInt(itemObj.quantity);
      const total = price * qty;
      grandTotal += total;

      const itemName =
        itemObj.item.length > 12 ? itemObj.item.slice(0, 12) + "." : itemObj.item.padEnd(13, " ");
      const qtyStr = String(qty).padStart(3, " ");
      const priceStr = price.toFixed(2).padStart(6, " ");
      const totalStr = total.toFixed(2).padStart(7, " ");
      doc.text(`${itemName}${qtyStr} ${priceStr} ${totalStr}`, 3, y);
      y += 5;
    }

    y += 2;
    doc.text("------------------------------", 40, y, { align: "center" });
    y += 6;
    doc.setFont("courier", "bold");
    doc.setFontSize(9);
    doc.text(`Grand Total: INR ${grandTotal.toFixed(2)}`, 40, y, { align: "center" });

    y += 8;
    const qrText = `Order# ${receiptData.orderid}\nName: ${receiptData.name}`;
    const qrData = await QRCode.toDataURL(qrText);
    doc.addImage(qrData, "PNG", 25, y, 30, 30);
    y += 35;

    doc.setFontSize(10);
    doc.setFont("courier", "bold");
    doc.text("THANK YOU!", 40, y, { align: "center" });

    doc.save(`Order-${receiptData.orderid}.pdf`);
  };

  return (
    <>
      <Nav />
      <div className="container mt-5 mb-5">
        <ToastContainer position="top-center" autoClose={3000} />

        {step === 1 && (
          <div className="row">
             <div className="col-md-4">
              <h4>Your Order</h4>
              {cart.length === 0 ? (
                <p className="text-muted">Cart is empty</p>
              ) : (
                <>
                  <ul className="list-group mb-3">
                    {cart.map((item) => (
                      <li key={item.itemid} className="list-group-item d-flex justify-content-between align-items-center">
                        <div>
                          <strong>{item.itemname}</strong>
                          <div className="d-flex align-items-center mt-1">
                            <span className="me-2">Qty:</span>
                            <input
                              type="number"
                              value={item.quantity}
                              min="1"
                              onChange={(e) => updateQuantity(item.itemid, parseInt(e.target.value))}
                              style={{ width: "60px" }}
                            />
                          </div>
                        </div>
                        <div className="text-end">
                          <div>₹{(item.price * item.quantity).toFixed(2)}</div>
                          <button className="btn btn-sm btn-danger mt-1" onClick={() => removeFromCart(item.itemid)}>
                            Remove
                          </button>
                        </div>
                      </li>
                    ))}
                  </ul>
                  <div className="fw-bold mb-2">Total: ₹{getTotal().toFixed(2)}</div>
                  <button className="btn btn-success w-100" onClick={handleCheckout}>
                    Checkout
                  </button>
                </>
              )}
            </div>
            <div className="col-md-8">
              {menuItems.map((item) => (
                <div key={item.itemid} className="d-flex border rounded p-2 mb-3">
                  <img
                    src={item.image}
                    alt={item.itemname}
                    style={{ width: "120px", height: "90px", objectFit: "cover", borderRadius: "5px" }}
                  />
                  <div className="ms-3 flex-grow-1">
                    <h5 className="mb-1">{item.itemname}</h5>
                    <p className="mb-1 text-muted">{item.description}</p>
                    <strong>₹{item.price}</strong>
                    <div className="mt-2 d-flex">
                      <input type="number" min="1" defaultValue="1" className="form-control w-25 me-2" id={`qty-${item.itemid}`} />
                      <button
                        className="btn btn-primary"
                        onClick={() =>
                          addToCart(item, parseInt(document.getElementById(`qty-${item.itemid}`).value))
                        }
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

           
          </div>
        )}

        {step === 2 && (
          <div className="card p-4">
            <h4 className="mb-3">Payment & Delivery Details</h4>
            <input type="text" className="form-control mb-2" placeholder="Your Name" value={formData.name} readOnly />
            <textarea 
              className="form-control mb-2" 
              placeholder="Delivery Address" 
              rows="3" 
              value={formData.address} 
              onChange={(e) => setFormData((p) => ({ ...p, address: e.target.value }))} 
            />
            <input 
              type="text" // Keep as text, but force numeric keyboard
              inputMode="numeric" 
              pattern="[0-9]*"
              className="form-control mb-3" 
              placeholder="Pincode (6 digits)" 
              value={formData.pincode} 
              maxLength={6} 
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, ''); // Ensure only digits are saved
                setFormData((p) => ({ ...p, pincode: value }))
              }} 
            />

            <MapContainer center={position || [22.5726, 88.3639]} zoom={13} style={{ height: "300px", marginBottom: "10px" }}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker position={position} setPosition={setPosition} setFormData={setFormData} />
            </MapContainer>

            <h5>Order Summary</h5>
            <ul className="list-group mb-3">
              {cart.map((item) => (
                <li key={item.itemid} className="list-group-item d-flex justify-content-between">
                  {item.itemname} x {item.quantity}
                  <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                </li>
              ))}
            </ul>
            <div className="fw-bold mb-3">Grand Total: ₹{getTotal().toFixed(2)}</div>

            <h5>Payment Method</h5>
            <select className="form-control mb-3" value={formData.paymentMethod} onChange={(e) => setFormData((p) => ({ ...p, paymentMethod: e.target.value }))}>
              <option>Cash on Delivery</option>
              <option>UPI</option>
            </select>

            <div className="d-flex gap-2">
              <button className="btn btn-primary w-50" onClick={handlePaymentSubmit}>
                Pay & Place Order
              </button>
              <button className="btn btn-secondary w-50" onClick={() => setStep(1)}>
                Back to Menu
              </button>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default Order;
