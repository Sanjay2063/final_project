import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Layout from './Layout';
const ProfilePage = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState({});
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    

    useEffect(() => {
        // Fetch user details on component mount
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to the login page if there is no token
            navigate('/login', { replace: true });
        }
        
        const fetchSkills = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employee/profile', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                console.log('Fetched skills:', response.data.user); // Log fetched data
                setUser(response.data.user);
            } catch (error) {
                console.error('Error fetching', error);
            }
        };
        fetchSkills();
    }, []);

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        const token = localStorage.getItem('token');
        try {
            const res = await axios.put(
                'http://localhost:5000/api/employee/password',
                { currentPassword, newPassword },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSuccess(res.data.message);
            toast.success('Password changed successfully!');
            setCurrentPassword('')
            setConfirmPassword('')
            setNewPassword('')
            setError('');
        } catch (error) {
            setError('Error changing password. Please check your current password.');
            setCurrentPassword('')
            setConfirmPassword('')
            setNewPassword('')
            console.error('Error changing password:', error);
        }
    };

    

    return (
        <Layout>
            <div className="container mt-5">
            <h2>Profile Page</h2>
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">User Details</h5>
                    <p><strong>Email:</strong> {user.email && user.email}</p>
                    <p><strong>Role:</strong> {user.role && user.role}</p>
                    <p><strong>Department:</strong> {user.department && user.department}</p>
                </div>
            </div>

            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Change Password</h5>
                    {error && <div className="alert alert-danger">{error}</div>}
                    {success && <div className="alert alert-success">{success}</div>}
                    <form onSubmit={handlePasswordChange}>
                        <div className="mb-3">
                            <label>Current Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="mb-3">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                className="form-control"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="submit" className="btn btn-primary">Change Password</button>
                    </form>
                </div>
            </div>

            <ToastContainer />
        </div>
        </Layout>
        
    );
};

export default ProfilePage;
