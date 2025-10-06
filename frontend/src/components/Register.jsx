import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Register = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phonenumber, setPhonenumber] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('https://cravory-erq6.onrender.com/register', { name, email, phonenumber, password })
      .then(result => {
        if (result.data === "Already registered") {
          toast.error("E-mail already registered! Please login.");
          
        } else {
          toast.success("Registered successfully! Please login.");
          setTimeout(() => navigate('/login'), 1500);
        }
      })
      .catch(() => toast.error("Registration failed. Try again."));
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        backgroundImage: "url('/regbg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container">
        <div className="row justify-content-center justify-content-md-start">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4 offset-md-1">
            <div className="bg-white p-4 rounded shadow w-100">
              <h2 className="mb-4 text-center text-danger">Register</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold">Name</label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    className="form-control"
                    onChange={(event) => setName(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold">Email Id</label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    className="form-control"
                    onChange={(event) => setEmail(event.target.value)}
                    required
                  />
                </div>
                <div className="mb-3 text-start">
                  <label className="form-label fw-semibold">Phone Number</label>
                  <input
                    type="text"
                    placeholder="Enter Phone Number"
                    className="form-control"
                    onChange={(event) => setPhonenumber(event.target.value)}
                    required
                  />
                </div>

                <div className="mb-4 text-start position-relative">
                  <label className="form-label fw-semibold">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter Password"
                    className="form-control"
                    onChange={(event) => setPassword(event.target.value)}
                    required
                  />
                  <span
                    onClick={() => setShowPassword(!showPassword)}
                    className="position-absolute"
                    style={{
                      top: '70%',
                      right: '15px',
                      transform: 'translateY(-50%)',
                      cursor: 'pointer',
                      color: '#666',
                    }}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </span>
                </div>

                <div className="d-flex gap-2">
                  <button type="submit" className="btn btn-danger w-50">Register</button>
                  <Link to="/Home" className="btn btn-warning w-50">Home</Link>
                </div>
              </form>

              <p className="text-center my-3 mb-0">Already have an account?</p>
              <Link to="/login" className="btn btn-outline-secondary w-100">Login</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
