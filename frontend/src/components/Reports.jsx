import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Label ,ResponsiveContainer
} from 'recharts';

const Reports = () => {
  const [ordersByPincode, setOrdersByPincode] = useState([]);
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const fetchOrdersByPincode = async () => {
    try {
      const response = await axios.get('https://cravory-erq6.onrender.com/api/reports/orders-by-pincode');
      setOrdersByPincode(response.data);
    } catch (error) {
      console.error('Error loading pincode data:', error);
    }
  };

  const fetchOrdersByDateRange = async () => {
    try {
      if (!startDate || !endDate) {
        alert('Please select both start and end date.');
        return;
      }

      const formattedStart = new Date(startDate).toISOString().split('T')[0];
      const formattedEnd = new Date(endDate).toISOString().split('T')[0];

      const response = await axios.get(
        `https://cravory-erq6.onrender.com/api/reports/orders-by-date?startDate=${formattedStart}&endDate=${formattedEnd}`
      );
      setSelectedOrders(response.data);
    } catch (error) {
      console.error('Error loading orders by date range:', error);
    }
  };

  useEffect(() => {
    fetchOrdersByPincode();
  }, []);

  return (
    <div className="p-6 w-full max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Orders by Pincode</h2>

      {ordersByPincode.length === 0 ? (
        <p>No data available.</p>
      ) : (
        
        <ResponsiveContainer width="100%" height={300}>
  <BarChart data={ordersByPincode} margin={{ top: 20, right: 20, left: 20, bottom: 50 }}>
    
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="pincode">
      <Label value="Pincode" offset={-10} position="insideBottom" />
    </XAxis>
    <YAxis allowDecimals={false}>
      <Label
        value="Order Count"
        angle={-90}
        position="insideLeft"
        style={{ textAnchor: 'middle' }}
      />
    </YAxis>
    <Tooltip />
    <Legend verticalAlign="top" height={2} /> {/* This moves the legend to bottom */}
    <Bar dataKey="orderCount" fill="#82ca9d" label={{ position: 'top' }} />
    
  </BarChart>
</ResponsiveContainer>


      )}

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-2">Date Range Filter</h3>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 mr-2"
        />
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="border p-2 mr-2"
        />
        <button
          onClick={fetchOrdersByDateRange}
          className="bg-black text-white px-4 py-2 rounded"
        >
          Get Report
        </button>
      </div>

      <div className="mt-6">
        <h3 className="text-xl font-semibold mb-2">Orders with Items (Flat List):</h3>
        {selectedOrders.length === 0 ? (
          <p>No orders in selected date range.</p>
        ) : (
          <table className="min-w-full table-auto border border-gray-300">
            <thead>
  <tr className="bg-gray-100">
    <th className="px-4 py-2 border">Order ID</th>
    <th className="px-4 py-2 border">Name</th>
    <th className="px-4 py-2 border">Date</th>
    <th className="px-4 py-2 border">Pincode</th>
    <th className="px-4 py-2 border">Delivery Person</th>
    <th className="px-4 py-2 border">Items</th>
    <th className="px-4 py-2 border">Total Price</th>
  </tr>
</thead>
      <tbody>
  {selectedOrders.map((order, index) => (
    <tr key={index} className="border-t">
      <td className="px-4 py-2 border">{order.orderid}</td>
      <td className="px-4 py-2 border">{order.name}</td>
      <td className="px-4 py-2 border">
        {new Date(order.orderDate).toLocaleDateString('en-CA')}
      </td>
      <td className="px-4 py-2 border">{order.pincode}</td>
      <td className="px-4 py-2 border">{order.deliveryperson}</td>
      <td className="px-4 py-2 border">{order.items}</td>
      <td className="px-4 py-2 border">{order.total_price}</td>
    </tr>
  ))}
</tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Reports;
