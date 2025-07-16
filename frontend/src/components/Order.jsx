import { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import jsPDF from 'jspdf';
import * as QRCode from 'qrcode';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './Nav';
import Footer from './Footer';

const Order = () => {
  const navigate = useNavigate();
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [formData, setFormData] = useState({
    orderNumber: '',
    orderDate: new Date().toLocaleDateString(),
    name: '',
    address: '',
    pincode: '',
    items: [{ item: '', quantity: 1 }],
    deliveryperson: ''
  });

  const [menuItems, setMenuItems] = useState([]);
  const [receiptData, setReceiptData] = useState(null);

 useEffect(() => {
  const userEmail = localStorage.getItem('userEmail');
  if (!userEmail) {
    navigate('/home', { state: { toast: "Please login to place an order." } });
    setTimeout(() => navigate('/Login'), 3000);
    return;
  }

  axios.get(`http://localhost:40001/user-info/${userEmail}`)
    .then(res => {
      setFormData(prev => ({
        ...prev,
        name: res.data.name,
      }));
    })
    .catch(() => {
      toast.error('Failed to fetch user info. Please login again.');
      localStorage.removeItem('userEmail');
      navigate('/Login');
    });

  axios.get('http://localhost:40001/next-order-number')
    .then(res => {
      setFormData(prev => ({
        ...prev,
        orderNumber: res.data.nextOrderNumber
      }));
    })
    .catch(() => {
      toast.error('Failed to fetch next order number.');
    });

  axios.get('http://localhost:40001/menu-items')
    .then(res => setMenuItems(res.data))
    .catch(() => toast.error('Failed to fetch menu items.'));

  // ✅ Fetch delivery persons
  axios.get('http://localhost:40001/delivery-persons')
    .then(res => setDeliveryPersons(res.data))
    .catch(() => toast.error('Failed to fetch delivery persons.'));
}, [navigate]);


  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const addItem = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { item: '', quantity: 1 }]
    }));
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      items: updatedItems
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('http://localhost:40001/place-order', formData)
      .then(res => {
        toast.success(res.data.message || "Order placed successfully!");
        setReceiptData({ ...formData, orderNumber: res.data.orderNumber });
        setFormData(prev => ({
          ...prev,
          orderNumber: res.data.orderNumber,
          orderDate: new Date().toLocaleDateString(),
          address: '',
          pincode: '',
          items: [{ item: '', quantity: 1 }],
          deliveryperson: ''
        }));
      })
      .catch(() => toast.error('Failed to place order.'));
  };

 const handleDownloadSlip = async () => {
  if (!receiptData) return;

  const docHeight = 100 + receiptData.items.length * 10 + 40;
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: [80, docHeight] });

  // Load logo image
  const logoImg = new Image();
  logoImg.src = '/logo.png';
  await new Promise(resolve => {
    logoImg.onload = resolve;
  });

  let y = 20;
  doc.addImage(logoImg, 'PNG', 30, 1, 20, 20); // Centered Logo

  // Header
  doc.setFont('courier', 'bold');
  doc.setFontSize(12);
  doc.text('CRAVORY RESTAURANT', 40, y, { align: 'center' });

  y += 5;
  doc.setFontSize(10);
  doc.setFont('courier', 'normal');
  doc.text('Order Receipt', 40, y, { align: 'center' });

  y += 4;
  doc.text('------------------------------', 40, y, { align: 'center' });
  y += 6;

  // Order No
  doc.text('Order No:', 5, y);
  doc.text(receiptData.orderNumber, 75, y, { align: 'right' });
  y += 5;

  // Date
  doc.text('Date:', 5, y);
  doc.text(receiptData.orderDate, 75, y, { align: 'right' });
  y += 7; // Extra space between date and name

  // Name
  doc.text('Name:', 5, y);
  doc.text(receiptData.name, 75, y, { align: 'right' });
  y += 5;

  // Address (wrapped)
  const addressLabel = 'Address:';
  const addressX = 5;
  const addressTextX = 23;
  const maxAddressWidth = 50;

  doc.text(addressLabel, addressX, y);
  const addressLines = doc.splitTextToSize(receiptData.address, maxAddressWidth);
  addressLines.forEach((line, index) => {
    doc.text(line, addressTextX, y);
    y += 5;
  });

  // Pincode
  doc.text('Pincode:', 5, y);
  doc.text(receiptData.pincode, 75, y, { align: 'right' });
  y += 5;

  // Item Table Header
  y += 4;
  doc.setFont('courier', 'bold');
  doc.text('Item          Qty   Price   Total', 5, y);
  doc.setFont('courier', 'normal');
  y += 4;

  // Item Details
  let grandTotal = 0;

  for (const itemObj of receiptData.items) {
    const matched = menuItems.find(m => m.itemName === itemObj.item);
    const price = matched ? parseFloat(matched.price) : 0;
    const qty = parseInt(itemObj.quantity);
    const total = price * qty;
    grandTotal += total;

    const itemName = itemObj.item.length > 14 ? itemObj.item.slice(0, 14) + '.' : itemObj.item.padEnd(15, ' ');
    const qtyStr = String(qty).padStart(3, ' ');
    const priceStr = price.toFixed(2).padStart(7, ' ');
    const totalStr = total.toFixed(2).padStart(7, ' ');

    doc.text(`${itemName}${qtyStr} ${priceStr} ${totalStr}`, 3, y);
    y += 5;
  }

  // Divider & Grand Total
  y += 2;
  doc.text('------------------------------', 40, y, { align: 'center' });
  y += 6;

  doc.setFont('courier', 'bold');
  doc.setFontSize(8);
  doc.text(`Grand Total: INR ${grandTotal.toFixed(2)}`, 40, y, { align: 'center' });

  // QR Code
  y += 8;
  const qrText = `Order# ${receiptData.orderNumber}\nName: ${receiptData.name}`;
  const qrData = await QRCode.toDataURL(qrText);
  doc.addImage(qrData, 'PNG', 25, y, 30, 30);
  y += 35;

  // Thank you
  doc.setFontSize(10);
  doc.setFont('courier', 'bold');
  doc.text('THANK YOU!', 40, y, { align: 'center' });

  doc.save(`Order-${receiptData.orderNumber}.pdf`);
  // setTimeout(() => navigate('/Home'), 2000);
};



  return (
    <>
      <Nav />
      <div className="container mt-5 mb-5">
        <ToastContainer position="top-center" autoClose={3000} />
        <h2 className="text-center mb-4">Place an Order</h2>
        <div className="row justify-content-center">
          <div className="col-md-8">
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-3" value={formData.orderNumber} readOnly />
              <input type="text" className="form-control mb-3" value={formData.orderDate} readOnly />
              <input type="text" className="form-control mb-3" name="name" value={formData.name} required readOnly />
              
              <textarea className="form-control mb-3" name="address" placeholder="Enter Address" value={formData.address} onChange={handleChange} required />
              <input type="text" className="form-control mb-3" name="pincode" placeholder="Pincode" value={formData.pincode} onChange={handleChange} required />

              <h5>Order Items</h5>
              {formData.items.map((itemObj, index) => (
                <div key={index} className="d-flex gap-2 mb-2">
                  <select
                    className="form-control"
                    value={itemObj.item}
                    onChange={(e) => handleItemChange(index, 'item', e.target.value)}
                    required
                  >
                    <option value="">Select Item</option>
                    {menuItems.map(menu => (
                      <option key={menu.itemId} value={menu.itemName}>
                        {menu.itemName} (₹{menu.price})
                      </option>
                    ))}
                  </select>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    placeholder="Qty"
                    value={itemObj.quantity}
                    onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
                    required
                  />
                  {formData.items.length > 1 && (
                    <button type="button" className="btn btn-danger" onClick={() => removeItem(index)}>X</button>
                  )}
                </div>
              ))}
              <div className="mb-3">
                <button type="button" className="btn btn-secondary" onClick={addItem}>+ Add Another Item</button>
              </div>

              {/* Order Summary Table */}
              {formData.items.length > 0 && (
                <div className="mt-4">
                  <h5>Order Summary</h5>
                  <table className="table table-bordered">
                    <thead>
                      <tr>
                        <th>Item</th>
                        <th>Qty</th>
                        <th>Unit Price (₹)</th>
                        <th>Total (₹)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {formData.items.map((itemObj, index) => {
                        const matchedItem = menuItems.find(menu => menu.itemName === itemObj.item);
                        const unitPrice = matchedItem ? parseFloat(matchedItem.price) : 0;
                        const quantity = parseInt(itemObj.quantity) || 0;
                        const total = unitPrice * quantity;
                        return (
                          <tr key={index}>
                            <td>{itemObj.item}</td>
                            <td>{quantity}</td>
                            <td>{unitPrice.toFixed(2)}</td>
                            <td>{total.toFixed(2)}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                  <div className="text-end fw-bold">
                    Grand Total: ₹{formData.items.reduce((acc, item) => {
                      const matchedItem = menuItems.find(menu => menu.itemName === item.item);
                      const price = matchedItem ? parseFloat(matchedItem.price) : 0;
                      return acc + price * (parseInt(item.quantity) || 0);
                    }, 0).toFixed(2)}
                  </div>
                </div>
              )}

              <select
              className="form-control mb-3"
              name="deliveryperson"
              value={formData.deliveryperson}
              onChange={handleChange}
              required
              >
              <option value="">Select Delivery Person</option>
               {deliveryPersons.map(dp => (
               <option key={dp.DeliveryPerson_ID} value={dp.Name}>
               {dp.Name} ({dp.Gender}) - {dp.AreaCode}
              </option>
            ))}
            </select>


              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-primary w-50">Place Order</button>
                <button type="button" className="btn btn-warning w-50" onClick={() => navigate('/Home')}>Cancel</button>
              </div>
            </form>

            {receiptData && (
              <div className="text-center mt-4">
                <button className="btn btn-success" onClick={handleDownloadSlip}>
                  Download Order Slip
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Order;
