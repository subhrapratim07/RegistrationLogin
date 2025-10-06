import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();

    axios.post('https://cravory-erq6.onrender.com/login', { email, password })
      .then(result => {
        if (result.data.message === "Success") {
          toast.success('Login successful!');
          localStorage.setItem('userEmail', result.data.email);
          localStorage.setItem('userRole', result.data.role); // ✅ Save role
          setTimeout(() => {
            navigate('/Home');
          }, 1000);
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 401) {
          toast.error('Incorrect password or user not found!');
        } else {
          toast.error('Something went wrong. Please try again later.');
          console.error("Login error:", error);
        }
      });
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center"
      style={{
        backgroundImage: "url('/logbg.png')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container">
        <div className="row justify-content-center justify-content-lg-end">
          <div className="col-12 col-sm-10 col-md-6 col-lg-4 me-lg-5">
            <div className="bg-white p-4 rounded shadow w-100">
              <h2 className="mb-4 text-center text-danger">Login</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3 text-start">
                  <label htmlFor="email" className="form-label fw-semibold">Email ID</label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Enter Email"
                    className="form-control"
                    onChange={e => setEmail(e.target.value)}
                    value={email}
                    required
                  />
                </div>

                <div className="mb-4 text-start position-relative">
                  <label htmlFor="password" className="form-label fw-semibold">Password</label>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    placeholder="Enter Password"
                    className="form-control"
                    onChange={e => setPassword(e.target.value)}
                    value={password}
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
                  <button type="submit" className="btn btn-danger w-50">Login</button>
                  <Link to="/home" className="btn btn-warning w-50">Home</Link>
                </div>
              </form>

              <p className="text-center my-3 mb-0">Don’t have an account?</p>
              <Link to="/register" className="btn btn-outline-secondary w-100">Register</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
