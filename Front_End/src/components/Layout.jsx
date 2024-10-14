// src/components/Layout.jsx
import React from 'react';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="app-container" style={{ display: 'flex' }}>
            <Sidebar />
            <div className="content" style={{ marginLeft: '250px', padding: '20px', width: '100%' }}>
                {children}
            </div>
        </div>
    );
};

export default Layout;
