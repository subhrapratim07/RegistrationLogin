import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import jsPDF from 'jspdf';
import * as QRCode from "qrcode";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Nav from './Nav';
import Footer from './Footer';

const BookTable = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    guests: '',
    date: '',
    time: '',
  });

  // ✅ Session & User Info
  useEffect(() => {
    const userEmail = localStorage.getItem('userEmail');
    if (!userEmail) {
      toast.error("Session expired. Please login again.");
      setTimeout(() => navigate('/Login'), 2000);
      return;
    }

    axios.get(`https://cravory-erq6.onrender.com/users/${userEmail}`)
      .then(res => {
        if (res.data) {
          setFormData(prev => ({
            ...prev,
            name: res.data.name || '',
            email: res.data.email || '',
            phone: res.data.phone || ''
          }));
        }
      })
      .catch(() => {
        localStorage.removeItem('userEmail');
        toast.error("Session expired. Please login again.");
        setTimeout(() => navigate('/Login'), 2000);
      });
  }, [navigate]);

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  // 🔹 Auto-generate PDF receipt
  const generateReceipt = async (data) => {
    const doc = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: [80, 200],
    });

    const now = new Date();
    const timestamp = now.toLocaleString('en-GB');

    const logoImg = new Image();
    logoImg.src = '/logo.png';
    await new Promise(resolve => (logoImg.onload = resolve));
    doc.addImage(logoImg, 'PNG', 30, 5, 20, 20);

    doc.setFontSize(14);
    doc.text('CRAVORY RESTAURANT', 40, 30, { align: 'center' });

    doc.setFontSize(10);
    doc.text('******************************', 40, 36, { align: 'center' });
    doc.text('RECEIPT', 40, 42, { align: 'center' });
    doc.text('******************************', 40, 48, { align: 'center' });

    doc.setFontSize(9);
    doc.text('Terminal', 10, 54);
    doc.text(timestamp, 10, 60);
    doc.text('______________________________', 40, 65, { align: 'center' });

    const fields = [
      ['Name', data.name],
      ['Email', data.email],
      ['Phone', data.phone],
      ['Date', data.date],
      ['Time', data.time],
      ['Guests', data.guests],
    ];

    let y = 72;
    fields.forEach(([label, value]) => {
      doc.text(`${label}:`, 10, y);
      doc.text(`${value}`, 70, y, { align: 'right' });
      y += 6;
    });

    doc.text('______________________________', 40, y + 3, { align: 'center' });

    y += 12;
    doc.setFontSize(10);
    doc.text('QR for confirmation', 40, y, { align: 'center' });

    const qrText = `Booking for ${data.name} on ${data.date} at ${data.time}`;
    const qrData = await QRCode.toDataURL(qrText);
    doc.addImage(qrData, 'PNG', 25, y + 5, 30, 30);

    doc.setFontSize(12);
    doc.text('********** THANK YOU! **********', 40, y + 42, { align: 'center' });

    doc.save(`CRAVORY-Booking-Slip-${data.name}.pdf`);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const snapshot = { ...formData };

    try {
      const res = await axios.post('https://cravory-erq6.onrender.com/book-table', formData);
      toast.success(res.data.message || "Booking Successful!");

      // Auto-generate PDF
      await generateReceipt(snapshot);

      // Reset form (guests, date, time)
      setFormData(prev => ({
        ...prev,
        guests: '',
        date: '',
        time: '',
      }));

      // Redirect to Home after short delay
      setTimeout(() => navigate('/Home'), 2000);

    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed.');
    }
  };

  // 🔹 Generate available dates (5 days ahead)
  const getNextFiveDates = () => {
    const dates = [];
    const options = { weekday: 'short', day: 'numeric' };
    for (let i = 0; i < 5; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);
      dates.push({
        label: date.toLocaleDateString('en-US', options),
        value: date.toISOString().split('T')[0],
      });
    }
    return dates;
  };

  // 🔹 Generate time slots (12:00 PM to 8:00 PM, 30-min gap)
  const getTimeSlots = () => {
    const slots = [];
    const start = new Date();
    start.setHours(12, 0, 0, 0);
    for (let i = 0; i < 17; i++) {
      const slot = new Date(start.getTime() + i * 30 * 60000);
      slots.push(slot.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true }));
    }
    return slots;
  };

  const availableDates = getNextFiveDates();
  const timeSlots = getTimeSlots();

  return (
    <>
      <Nav />
      <div className="container mt-5 mb-5">
        <ToastContainer position="top-center" autoClose={3000} />
        <h2 className="text-center mb-4">Book a Table</h2>

        <div className="row justify-content-center">
          <div className="col-md-6">
            <form onSubmit={handleSubmit}>
              <input type="text" className="form-control mb-3" name="name" value={formData.name} readOnly />
              <input type="email" className="form-control mb-3" name="email" value={formData.email} readOnly />
              <input type="tel" className="form-control mb-3" name="phone" value={formData.phone} readOnly />

              <select className="form-control mb-3" name="guests" value={formData.guests} onChange={handleChange} required>
                <option value="">Select Guests</option>
                {[...Array(10)].map((_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1} Guest{i > 0 ? 's' : ''}</option>
                ))}
              </select>

              <h6>Select Date</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {availableDates.map((d, i) => (
                  <button type="button" key={i}
                    className={`btn btn-outline-secondary ${formData.date === d.value ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, date: d.value })}
                  >
                    {d.label}
                  </button>
                ))}
              </div>

              <h6>Select Time Slot</h6>
              <div className="d-flex flex-wrap gap-2 mb-3">
                {timeSlots.map((slot, i) => (
                  <button type="button" key={i}
                    className={`btn btn-outline-dark ${formData.time === slot ? 'active' : ''}`}
                    onClick={() => setFormData({ ...formData, time: slot })}
                  >
                    {slot}
                  </button>
                ))}
              </div>

              <div className="d-flex gap-2">
                <button type="submit" className="btn btn-danger w-50">Book Table</button>
                <Link to="/Home" className="btn btn-warning w-50">Home</Link>
              </div>
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BookTable;
