// src/pages/Dashboard.jsx
import React, { useEffect } from 'react';
import Layout from './Layout';
import AdminDashboard from './AdminDashboard';
import EmployeeDashboard from './EmployeeDashboard';
import { useNavigate } from 'react-router-dom';
const Dashboard = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to the login page if there is no token
            navigate('/login', { replace: true });
        }
    }, [navigate]);
    const role = localStorage.getItem('role'); // Fetch role from local storage (set at login)
    console.log(role)
    return (
        <Layout>
            {role === 'admin' ? (
                <AdminDashboard />
            ) : (
                <EmployeeDashboard />
            )}
        </Layout>
    );
};

export default Dashboard;

