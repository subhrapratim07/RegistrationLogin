import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import Nav from './Nav';
import Footer from './Footer';

const areaOptions = [
  { code: 'A01', name: 'Sector 1' },
  { code: 'A02', name: 'Sector 2' },
  { code: 'A03', name: 'Sector 3' },
  { code: 'A04', name: 'Sector 4' },
  { code: 'A05', name: 'Sector 5' }
];

const DeliveryPersonForm = () => {
  const [formData, setFormData] = useState({
    DeliveryPerson_ID: uuidv4().slice(0, 8),
    Name: '',
    Phone: '',
    Gender: 'Boy',
    Vehicle_No: '',
    AreaCode: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post('https://cravory-erq6.onrender.com/delivery_persons', formData)
      .then(res => {
        toast.success(res.data.message);
        setFormData({
          DeliveryPerson_ID: uuidv4().slice(0, 8),
          Name: '',
          Phone: '',
          Gender: 'Boy',
          Vehicle_No: '',
          AreaCode: ''
        });
      })
      .catch(() => toast.error('Failed to add delivery person.'));
  };

  return (
    <>
      <Nav />
      <div className="container mt-5 mb-5">
        <ToastContainer position="top-center" />
        <h2 className="text-center mb-4">Add Delivery Person</h2>
        <form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm">
          <div className="mb-3">
            <label className="form-label">ID (auto)</label>
            <input type="text" className="form-control" value={formData.DeliveryPerson_ID} readOnly />
          </div>
          <div className="mb-3">
            <label className="form-label">Name</label>
            <input type="text" className="form-control" name="Name" value={formData.Name} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Phone</label>
            <input type="tel" className="form-control" name="Phone" value={formData.Phone} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Gender</label>
            <select className="form-select" name="Gender" value={formData.Gender} onChange={handleChange}>
              <option value="Boy">Boy</option>
              <option value="Girl">Girl</option>
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Vehicle No</label>
            <input type="text" className="form-control" name="Vehicle_No" value={formData.Vehicle_No} onChange={handleChange} required />
          </div>
          <div className="mb-3">
            <label className="form-label">Area Code</label>
            <select className="form-select" name="AreaCode" value={formData.AreaCode} onChange={handleChange} required>
              <option value="">Select Area</option>
              {areaOptions.map(area => (
                <option key={area.code} value={area.code}>{area.name} ({area.code})</option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-primary">Add Delivery Person</button>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default DeliveryPersonForm;
