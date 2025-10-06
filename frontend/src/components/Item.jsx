import { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { v4 as uuidv4 } from 'uuid';
import Nav from './Nav';
import Footer from './Footer';

const Item = () => {
  const [items, setItems] = useState([
    {
      itemId: uuidv4().slice(0, 8),
      itemName: '',
      description: '',
      price: '',
      image: ''
    }
  ]);

  const handleChange = (index, field, value) => {
    const updatedItems = [...items];
    updatedItems[index][field] = value;
    setItems(updatedItems);
  };

  const handleImageChange = (index, file) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const updatedItems = [...items];
      updatedItems[index].image = reader.result;
      setItems(updatedItems);
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const addItemField = () => {
    setItems(prev => [
      ...prev,
      {
        itemId: uuidv4().slice(0, 8),
        itemName: '',
        description: '',
        price: '',
        image: ''
      }
    ]);
  };

  const removeItemField = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    axios.post('https://cravory-erq6.onrender.com/items', { items })
      .then(res => {
        toast.success(res.data.message || 'Items added successfully!');
        setItems([
          {
            itemId: uuidv4().slice(0, 8),
            itemName: '',
            description: '',
            price: '',
            image: ''
          }
        ]);
      })
      .catch(() => toast.error('Failed to add items.'));
  };

  return (
    <>
      <Nav />
      <div className="container mt-5 mb-5">
        <ToastContainer position="top-center" autoClose={3000} />
        <h2 className="text-center mb-4">Add Menu Items</h2>
        <form onSubmit={handleSubmit}>
          {items.map((item, index) => (
            <div key={index} className="border p-3 mb-4 rounded shadow-sm row">
              <div className="col-md-8">
                <div className="mb-2">
                  <label className="form-label">Item ID (auto):</label>
                  <input type="text" className="form-control" value={item.itemId} readOnly />
                </div>
                <div className="mb-2">
                  <label className="form-label">Item Name:</label>
                  <input type="text" className="form-control" value={item.itemName} onChange={(e) => handleChange(index, 'itemName', e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Item Description:</label>
                  <textarea className="form-control" rows="2" value={item.description} onChange={(e) => handleChange(index, 'description', e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Price (₹):</label>
                  <input type="number" className="form-control" value={item.price} onChange={(e) => handleChange(index, 'price', e.target.value)} required />
                </div>
                <div className="mb-2">
                  <label className="form-label">Upload Item Picture:</label>
                  <input type="file" accept="image/*" className="form-control" onChange={(e) => handleImageChange(index, e.target.files[0])} />
                </div>
              </div>

              <div className="col-md-4 d-flex flex-column align-items-center justify-content-center">
                {item.image ? (
                  <img src={item.image} alt="Preview" className="img-fluid rounded" style={{ maxHeight: '150px', objectFit: 'cover' }} />
                ) : (
                  <div className="text-muted text-center">No image uploaded</div>
                )}
              </div>

              {items.length > 1 && (
                <div className="text-end mt-2">
                  <button type="button" className="btn btn-danger btn-sm" onClick={() => removeItemField(index)}>Remove</button>
                </div>
              )}
            </div>
          ))}

          <div className="d-flex gap-2 mb-3">
            <button type="button" className="btn btn-secondary" onClick={addItemField}>+ Add Another Item</button>
            <button type="submit" className="btn btn-primary">Submit Items</button>
          </div>
        </form>
      </div>
      <Footer />
    </>
  );
};

export default Item;
