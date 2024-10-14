// src/pages/HomePage.jsx
import React, { useEffect } from 'react';
import Layout from './Layout'; // Import the Layout component
import { useNavigate } from 'react-router-dom';
const HomePage = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to the login page if there is no token
            navigate('/login', { replace: true });
        }
    }, [navigate]);
    const username = localStorage.getItem('username');

    return (
        <Layout>
            <h1>Don't have access {username}</h1>
            
        </Layout>
    );
};

export default HomePage;
