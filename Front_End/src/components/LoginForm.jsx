import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './LoginForm.css'; // Import the CSS for custom styling

const LoginForm = () => {
    const [formData, setFormData] = useState({ email: '', password: '' });
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/login', formData);
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('username', formData.email);
            localStorage.setItem('role', response.data.role);
            navigate('/dashboard'); // Redirect to home page
        } catch (error) {
            console.error(error.response.data);
            toast.error('User not found or password is incorrect'); // Use toast for error message
        }
    };

    return (
        <div className="container-fluid vh-100 d-flex justify-content-center align-items-center bg-light">
            <div className="col-md-4">
                <div className="card shadow-lg border-0">
                    <div className="card-body">
                        <h3 className="card-title text-center">Login</h3>
                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="Enter your email"
                                    required
                                />
                            </div>
                            <div className="form-group mt-3">
                                <label htmlFor="password">Password</label>
                                <input
                                    type="password"
                                    className="form-control"
                                    id="password"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    placeholder="Enter your password"
                                    required
                                />
                            </div>
                            <button type="submit" className="btn btn-primary w-100 mt-4">
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default LoginForm;
