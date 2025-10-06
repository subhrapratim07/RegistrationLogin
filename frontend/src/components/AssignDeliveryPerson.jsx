import { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const AssignDeliveryPerson = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryPersons, setDeliveryPersons] = useState([]);
  const [assignedData, setAssignedData] = useState({}); // { orderid: deliveryPersonName }

  // Fetch orders without delivery person
  const fetchOrders = async () => {
    try {
      const res = await axios.get("https://cravory-erq6.onrender.com/orders");
      setOrders(res.data);
    } catch (err) {
      toast.error("Failed to fetch orders");
      console.error(err);
    }
  };

  // Fetch all delivery persons
  const fetchDeliveryPersons = async () => {
    try {
      const res = await axios.get("https://cravory-erq6.onrender.com/delivery_persons");
      setDeliveryPersons(res.data);
    } catch (err) {
      toast.error("Failed to fetch delivery persons");
      console.error(err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchDeliveryPersons();
  }, []);

  const handleSelect = (orderid, personName) => {
    setAssignedData((prev) => ({ ...prev, [orderid]: personName }));
  };

  const handleAssign = async (orderid) => {
    const deliveryPerson = assignedData[orderid];
    if (!deliveryPerson) {
      toast.error("Please select a delivery person");
      return;
    }

    try {
      await axios.put(`https://cravory-erq6.onrender.com/orders/${orderid}/assign-delivery`, {
        deliveryperson: deliveryPerson
      });
      toast.success("Delivery person assigned successfully");
      fetchOrders();
      setAssignedData((prev) => {
        const updated = { ...prev };
        delete updated[orderid];
        return updated;
      });
    } catch (err) {
      toast.error("Failed to assign delivery person");
      console.error(err);
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <ToastContainer position="top-center" autoClose={3000} />
      <h3 className="mb-4">Assign Delivery Person</h3>

      {orders.length === 0 ? (
        <p className="text-muted">No orders pending delivery assignment</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Order ID</th>
              <th>Customer Name</th>
              <th>Select Delivery Person</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.orderid}>
                <td>{order.orderid}</td>
                <td>{order.name}</td>
                <td>
                  <select
                    className="form-control"
                    value={assignedData[order.orderid] || ""}
                    onChange={(e) => handleSelect(order.orderid, e.target.value)}
                  >
                    <option value="">-- Select --</option>
                    {deliveryPersons.map((dp) => (
                      <option key={dp.DeliveryPerson_ID} value={dp.Name}>
                        {dp.Name} ({dp.Vehicle_No})
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => handleAssign(order.orderid)}
                  >
                    Assign
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AssignDeliveryPerson;
