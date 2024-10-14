import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import HomePage from './components/HomePage';
import Dashboard from './components/Dashboard';
import ApprovalTable from './components/ApprovalTable';
import AddSkill from './components/AddSkill';
import RegisterForm from './components/RegisterForm';
import ProfilePage from './components/ProfilePage';
import AdminSkillManager from './components/AdminSkillManager';
const App = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LoginForm />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/approve" element={<ApprovalTable />} />
                <Route path="/skill" element={<AddSkill />} /> {/* Fixed this line */}
                <Route path="/emp" element={<RegisterForm />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/course" element={<AdminSkillManager />} />
            </Routes>
        </Router>
    );
};

export default App;