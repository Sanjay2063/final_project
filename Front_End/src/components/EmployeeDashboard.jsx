import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { Bar } from 'react-chartjs-2';
import { useNavigate } from 'react-router-dom';
import 'chart.js/auto';

const EmployeeDashboard = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [selectedSkill, setSelectedSkill] = useState(null);
    const [showModal, setShowModal] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login', { replace: true });
        }
        
        const fetchSkills = async () => {
            try {
                const response = await axios.get('http://localhost:5000/api/employee/skills', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setSkills(response.data.skills);
            } catch (error) {
                console.error('Error fetching skills:', error);
            }
        };
        fetchSkills();
    }, []);

    const handleEditSkill = (index) => {
        const skill = skills[index];
        setSelectedSkill({ ...skill, index });
        setShowModal(true);
    };

    const handleSaveChanges = async () => {
        try {
            const response = await axios.put('http://localhost:5000/api/employee/skills', {
                skillIndex: selectedSkill.index,
                skillname: selectedSkill.skillname,
                coursename: selectedSkill.coursename,
                certificate_link: selectedSkill.certificate_link,
                score: selectedSkill.score
            }, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSkills(response.data.skills);
            setShowModal(false);
        } catch (error) {
            console.error('Error updating skill:', error);
        }
    };

    const handleDeleteSkill = async (index) => {
        try {
            const response = await axios.delete(`http://localhost:5000/api/employee/skills/${index}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSkills(response.data.skills);
        } catch (error) {
            console.error('Error deleting skill:', error);
        }
    };

    const barData = {
        labels: skills.map(skill => skill.coursename), // Use course names on x-axis
        datasets: [
            {
                label: 'Scores',
                data: skills.map(skill => skill.score),
                backgroundColor: 'rgba(54, 162, 235, 0.6)',
                borderColor: 'rgba(54, 162, 235, 1)',
                borderWidth: 1
            }
        ]
    };

    const barOptions = {
        scales: {
            y: {
                beginAtZero: true,
                title: {
                    display: true,
                    text: 'Score'
                }
            },
            x: {
                title: {
                    display: true,
                    text: 'Course Name'
                }
            }
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Employee Dashboard</h1>
            <p className="lead text-center">Your skills</p>
            <table className="table table-striped table-hover table-bordered">
                <thead className="thead-dark">
                    <tr>
                        <th>Skill Name</th>
                        <th>Course Name</th>
                        <th>Certificate Link</th>
                        <th>Score</th>
                        <th>Approval</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {skills.map((skill, index) => (
                        <tr key={index}>
                            <td>{skill.skillname}</td>
                            <td>{skill.coursename}</td>
                            <td><a href={skill.certificate_link} target="_blank" rel="noopener noreferrer">View</a></td>
                            <td>{skill.score}/100</td>
                            <td>{skill.approval === null ? 'Pending' : skill.approval ? 'Approved' : 'Rejected'}</td>
                            <td>
                                <button className="btn btn-primary btn-sm" onClick={() => handleEditSkill(index)}>
                                    Edit
                                </button>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Bar Chart */}
            <div className="my-5">
                <Bar data={barData} options={barOptions} />
            </div>

            {/* Modal for editing skills */}
            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Edit Skill</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="form-group">
                        <label>Skill Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Skill Name"
                            value={selectedSkill?.skillname}
                            onChange={(e) => setSelectedSkill({ ...selectedSkill, skillname: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Course Name</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Course Name"
                            value={selectedSkill?.coursename}
                            onChange={(e) => setSelectedSkill({ ...selectedSkill, coursename: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Certificate Link</label>
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Enter Certificate Link"
                            value={selectedSkill?.certificate_link}
                            onChange={(e) => setSelectedSkill({ ...selectedSkill, certificate_link: e.target.value })}
                        />
                    </div>
                    <div className="form-group">
                        <label>Score</label>
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter Score"
                            value={selectedSkill?.score}
                            onChange={(e) => setSelectedSkill({ ...selectedSkill, score: e.target.value })}
                        />
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleSaveChanges}>
                        Save Changes
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EmployeeDashboard;
