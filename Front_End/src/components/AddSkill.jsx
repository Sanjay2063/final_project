import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const AddSkill = () => {
    const navigate = useNavigate();
    const [newSkill, setNewSkill] = useState({ skillname: '', coursename: '', certificate_link: '', score: '' });
    const [skills, setSkills] = useState([]);
    const [courses, setCourses] = useState([]);

    // Fetch skills from the backend
    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/skillname', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const skillNames = response.data.map(skill => skill.skillname);
            setSkills(skillNames);
        } catch (error) {
            console.error('Error fetching skills', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/coursename', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const courseNames = response.data.map(course => course.coursename);
            setCourses(courseNames);
        } catch (error) {
            console.error('Error fetching courses', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to the login page if there is no token
            navigate('/login', { replace: true });
        }
        fetchSkills();
        fetchCourses();
    }, []);

    // Handle adding a new skill
    const handleAddSkill = async () => {
        const score = parseInt(newSkill.score, 10);

        if (!newSkill.skillname || !newSkill.coursename || !newSkill.certificate_link || !newSkill.score) {
            toast.error('Please fill all fields before adding a skill.');
            return;
        }

        if (score < 0 || score > 100) {
            toast.error('Score must be between 0 and 100.');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found. Please log in.');
            }

            // Sending the new skill object to the backend
            await axios.post(
                'http://localhost:5000/api/employee/skills',
                {
                    skillname: newSkill.skillname,
                    coursename: newSkill.coursename,
                    certificate_link: newSkill.certificate_link,
                    score: newSkill.score
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            toast.success('Skill added successfully!');
            setNewSkill({ skillname: '', coursename: '', certificate_link: '', score: '' });
        } catch (error) {
            console.error('Error adding skill:', error.response ? error.response.data : error.message);
            toast.error('Failed to add skill. Please try again.');
        }
    };

    return (
        <Layout>
            <Container className="mt-5">
                <Card className="shadow-sm">
                    <Card.Body>
                        <h2 className="mb-4 text-center">Add a New Skill</h2>
                        <Form>
                            {/* Skill Name */}
                            <Form.Group controlId="formSkillName" className="mb-3">
                                <Form.Label>Skill Name</Form.Label>
                                <Form.Select
                                    value={newSkill.skillname}
                                    onChange={(e) => setNewSkill({ ...newSkill, skillname: e.target.value })}
                                    required
                                >
                                    <option value="">Select Skill Name</option>
                                    {skills.map((skill, index) => (
                                        <option key={index} value={skill}>
                                            {skill}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Course Name */}
                            <Form.Group controlId="formCourseName" className="mb-3">
                                <Form.Label>Course Name</Form.Label>
                                <Form.Select
                                    value={newSkill.coursename}
                                    onChange={(e) => setNewSkill({ ...newSkill, coursename: e.target.value })}
                                    required
                                >
                                    <option value="">Select Course Name</option>
                                    {courses.map((course, index) => (
                                        <option key={index} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>

                            {/* Certificate Link */}
                            <Form.Group controlId="formCertificateLink" className="mb-3">
                                <Form.Label>Certificate Link</Form.Label>
                                <Form.Control
                                    type="url"
                                    placeholder="Enter Certificate Link"
                                    value={newSkill.certificate_link}
                                    onChange={(e) => setNewSkill({ ...newSkill, certificate_link: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            {/* Score */}
                            <Form.Group controlId="formScore" className="mb-4">
                                <Form.Label>Score</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter Score (0-100)"
                                    min="0"
                                    max="100"
                                    value={newSkill.score}
                                    onChange={(e) => setNewSkill({ ...newSkill, score: e.target.value })}
                                    required
                                />
                            </Form.Group>

                            {/* Add Skill Button */}
                            <div className="d-grid">
                                <Button variant="primary" size="lg" onClick={handleAddSkill}>
                                    Add Skill
                                </Button>
                            </div>
                        </Form>
                    </Card.Body>
                </Card>

                {/* Toast Container to display toasts */}
                <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            </Container>
        </Layout>
    );
};

export default AddSkill;
