import React from 'react';
import './Sidebar.css';
import { Link, useLocation } from 'react-router-dom';
import image from './png-transparent-soft-skills-technology-engineer-science-technology-electronics-label-logo-thumbnail.png';

const Sidebar = () => {
    const role = localStorage.getItem('role'); // Get the role from local storage
    const location = useLocation(); // Get current URL location

    // Helper function to check if the current path is active
    const isActive = (path) => location.pathname === path;

    return (
        <div className="sidebar">
            <div className="sidebar-header">
                <img src={image} alt="Logo" className="logo" />
                <span className="website-name">Skill-Tracker</span>
            </div>
            <ul className="nav flex-column">
                <li className="nav-item">
                    <Link to="/dashboard" className={`nav-link ${isActive('/dashboard') ? 'active' : ''}`}>
                        <i className="fas fa-tachometer-alt"></i>
                        <span>Dashboard</span>
                    </Link>
                </li>
                
                {role === 'admin' ? (
                    <li className="nav-item">
                        <Link to="/emp" className={`nav-link ${isActive('/emp') ? 'active' : ''}`}>
                            <i className="fas fa-user-plus"></i>
                            <span>Add Employee</span>
                        </Link>
                    </li>
                ) : role === 'employee' ? (
                    <li className="nav-item">
                        <Link to="/profile" className={`nav-link ${isActive('/profile') ? 'active' : ''}`}>
                            <i className="fas fa-user"></i>
                            <span>Profile</span>
                        </Link>
                    </li>
                ) : null}

                {role === 'admin' ? (
                    <li className="nav-item">
                        <Link to="/approve" className={`nav-link ${isActive('/approve') ? 'active' : ''}`}>
                            <i className="fas fa-check"></i>
                            <span>Approve</span>
                        </Link>
                    </li>
                ) : role === 'employee' ? (
                    <li className="nav-item">
                        <Link to="/skill" className={`nav-link ${isActive('/skill') ? 'active' : ''}`}>
                            <i className="fas fa-book"></i>
                            <span>Add Skill</span>
                        </Link>
                    </li>
                ) : null}

                {role === 'admin' ? (
                    <li className="nav-item">
                        <Link to="/course" className={`nav-link ${isActive('/course') ? 'active' : ''}`}>
                            <i className="fas fa-tasks"></i>
                            <span>Skills Management</span>
                        </Link>
                    </li>
                ) : null}
            </ul>
            <div className="logout-section">
                <Link to="/" className="nav-link logout" onClick={() => {
                    localStorage.removeItem('token');
                    localStorage.removeItem('username');
                    localStorage.removeItem('role'); // Clear role on logout
                }}>
                    <i className="fas fa-sign-out-alt"></i>
                    <span>Logout</span>
                </Link>
            </div>
        </div>
    );
};

export default Sidebar;
