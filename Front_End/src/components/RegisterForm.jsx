import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Layout from './Layout';

const RegisterForm = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
        department: '',
    });
    const [users, setUsers] = useState([]);
    const [showModal, setShowModal] = useState(false); // State to manage modal visibility
    const [userIdToDelete, setUserIdToDelete] = useState(null); // State to hold the user ID to delete
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
        if (localStorage.getItem('role') !== 'admin') {
            navigate('/home', { replace: true });
        }

        // Fetch all registered users
        const fetchUsers = async () => {
            try {
                const token = localStorage.getItem('token'); // Adjust based on how you store your token
                const response = await axios.get('http://localhost:5000/api/users', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, [navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords don't match!");
            return;
        }

        try {
            await axios.post('http://localhost:5000/api/signup', formData);
            
            setFormData({
                email: '',
                password: '',
                confirmPassword: '',
                role: 'employee',
                department: '',
            });

            // Refresh user list after registration
            const response = await axios.get('http://localhost:5000/api/users', {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('token')}`,
                }});
            setUsers(response.data);
            toast.success('User registered successfully!');
        } catch (error) {
            console.error(error);
            toast.error('Error creating user');
        }
    };

    const handleShowModal = (userId) => {
        setUserIdToDelete(userId);
        setShowModal(true); // Show the modal
    };

    const handleDeleteUser = async () => {
        if (userIdToDelete) {
            try {
                const token = localStorage.getItem('token');
                await axios.delete(`http://localhost:5000/api/users/${userIdToDelete}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Remove user from the state
                setUsers(users.filter((user) => user._id !== userIdToDelete));
                toast.success('User deleted successfully!');
                setShowModal(false); // Close the modal after deletion
                setUserIdToDelete(null); // Reset the user ID
            } catch (error) {
                console.error('Error deleting user:', error);
                toast.error('Error deleting user');
            }
        }
    };

    return (
        <Layout>
            <div className="container mt-5">
                <div className="row">
                    <div className="col-md-6">
                        <div className="card shadow">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Register New User</h3>
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
                                            placeholder="Enter user's email"
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
                                            placeholder="Enter password"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="confirmPassword">Confirm Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            placeholder="Confirm password"
                                            required
                                        />
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="role">Role</label>
                                        <select
                                            className="form-control"
                                            id="role"
                                            name="role"
                                            value={formData.role}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="employee">Employee</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                    <div className="form-group mt-3">
                                        <label htmlFor="department">Department</label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="department"
                                            name="department"
                                            value={formData.department}
                                            onChange={handleInputChange}
                                            placeholder="Enter department"
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 mt-4">
                                        Register
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <h4 className="text-center mb-4">Registered Users</h4>
                        <table className="table table-bordered table-striped">
                            <thead className="thead-dark">
                                <tr>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user._id}>
                                        <td>{user.email}</td>
                                        <td>{user.role}</td>
                                        <td>{user.department}</td>
                                        <td>
                                            <button 
                                                className="btn btn-danger btn-sm" 
                                                onClick={() => handleShowModal(user._id)}>
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Modal for Confirmation */}
                <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }} tabIndex="-1" role="dialog" aria-labelledby="confirmModalLabel" aria-hidden={!showModal}>
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title" id="confirmModalLabel">Confirm Deletion</h5>
                            </div>
                            <div className="modal-body">
                                Are you sure you want to delete this user?
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                                <button type="button" className="btn btn-danger" onClick={handleDeleteUser}>Delete</button>
                            </div>
                        </div>
                    </div>
                </div>

                <ToastContainer />
            </div>
        </Layout>
    );
};

export default RegisterForm;
