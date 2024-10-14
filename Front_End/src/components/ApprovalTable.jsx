import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';


const ApprovalTable = () => {
    const navigate = useNavigate();
    const [pendingSkills, setPendingSkills] = useState([]);

    const getPendingSkills = async () => {
        const res = await axios.get(`http://localhost:5000/api/admin/pending-skills`, {
            headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        setPendingSkills(res.data);
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to the login page if there is no token
            navigate('/login', { replace: true });
        }
        if (localStorage.getItem('role') !== 'admin') {
            navigate('/home', { replace: true });
        }
        getPendingSkills();
    }, []);

    const handleApproval = async (skillId) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/approve-skill/${skillId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            // Refresh the pending skills list
            getPendingSkills();
        } catch (error) {
            console.error('Error approving skill:', error);
        }
    };

    const handleRejection = async (skillId) => {
        try {
            await axios.put(`http://localhost:5000/api/admin/reject-skill/${skillId}`, {}, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            // Refresh the pending skills list
            getPendingSkills();
        } catch (error) {
            console.error('Error rejecting skill:', error);
        }
    };

    return (
        <Layout>
            <div>
                <h1 className="mb-4">Pending skills</h1>
                <table className="table table-striped table-bordered">
                    <thead className="table-dark">
                        <tr>
                            <th>Email</th>
                            <th>Skill Name</th>
                            <th>Course Name</th>
                            <th>Score</th>
                            <th>Certificate Link</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pendingSkills.length > 0 ? (
                            pendingSkills.map(emp => (
                                emp && emp.skills.filter(skill => skill.approval === null).map((skill, skillIndex) => (
                                    <tr key={`${emp.id}-${skillIndex}`}>
                                        <td>{emp.email}</td>
                                        <td>{skill.skillname}</td>
                                        <td>{skill.coursename}</td>
                                        <td>{skill.score}</td>
                                        <td>
                                            <a href={skill.certificate_link} target="_blank" rel="noopener noreferrer">
                                                View
                                            </a>
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-success me-2"
                                                onClick={() => handleApproval(skill._id)}
                                                data-bs-toggle="tooltip"
                                                title="Approve Skill"
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn btn-danger"
                                                onClick={() => handleRejection(skill._id)}
                                                data-bs-toggle="tooltip"
                                                title="Reject Skill"
                                            >
                                                Reject
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ))
                        ) : (
                            <tr>
                                <td colSpan="6" className="text-center text-muted">
                                    No pending skills found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default ApprovalTable;
