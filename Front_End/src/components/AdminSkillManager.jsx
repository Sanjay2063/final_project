import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Layout from './Layout';
import { useNavigate } from 'react-router-dom';
const AdminSkillManager = () => {
    const navigate = useNavigate();
    const [skills, setSkills] = useState([]);
    const [courses, setcourses] = useState([]);
    const [newcourse, setNewcourse] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [loading, setLoading] = useState(false); // Loading state for data fetching
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isAdding, setIsAdding] = useState(false); // Loading state for adding skill

    const fetchSkills = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/employee/skillname', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSkills(response.data);
            setLoading(false);
        } catch (error) {
            setError('Error fetching skills');
            setLoading(false);
            console.error('Error fetching skills', error);
        }
    };

    const fetchCourses = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/coursename', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setcourses(response.data);
        } catch (error) {
            setError('Error fetching courses');
            console.error('Error fetching courses', error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            // Redirect to the login page if there is no token
            navigate('/login', { replace: true });
        }
        if(localStorage.getItem('role')!=='admin'){
            navigate('/home', { replace: true });
        }
        fetchSkills();
        fetchCourses();
    }, []);

    const handleAddSkill = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsAdding(true);
        try {
            const response = await axios.post('http://localhost:5000/api/employee/skillname', { skillname: newSkill },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setSkills([...skills, response.data.skill]);
            setSuccess('Skill added successfully');
            setNewSkill('');
            setIsAdding(false);
        } catch (error) {
            setError('Error adding skill');
            setIsAdding(false);
            console.error('Error adding skill', error);
        }

        setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);
    };

    const handleAddcourse = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setIsAdding(true);
        try {
            const response = await axios.post('http://localhost:5000/api/employee/coursename', { coursename: newcourse },
                { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } });
            setcourses([...courses, response.data.course]);
            setSuccess('Course added successfully');
            setNewcourse('');
            setIsAdding(false);
        } catch (error) {
            setError('Error adding course');
            setIsAdding(false);
            console.error('Error adding course', error);
        }

        setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);
    };

    const handleDeleteSkill = async (skillId) => {
        setError('');
        setSuccess('');
        try {
            await axios.delete(`http://localhost:5000/api/employee/skillname/${skillId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setSkills(skills.filter(skill => skill._id !== skillId));
            setSuccess('Skill deleted successfully');
        } catch (error) {
            setError('Error deleting skill');
            console.error('Error deleting skill', error);
        }

        setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);
    };

    const handleDeletecourse = async (courseId) => {
        setError('');
        setSuccess('');
        try {
            await axios.delete(`http://localhost:5000/api/employee/coursename/${courseId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setcourses(courses.filter(course => course._id !== courseId));
            setSuccess('Course deleted successfully');
        } catch (error) {
            setError('Error deleting course');
            console.error('Error deleting course', error);
        }

        setTimeout(() => {
            setSuccess('');
            setError('');
        }, 3000);
    };

    return (
        <Layout>
            <div className="container mt-4">
                <h2>Admin Skill Manager</h2>
                {error && <div className="alert alert-danger">{error}</div>}
                {success && <div className="alert alert-success">{success}</div>}

                {/* Form to add new skill and course side by side */}
                <div className="row mb-3">
                    <div className="col-md-6">
                        <form onSubmit={handleAddSkill}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={newSkill}
                                    onChange={(e) => setNewSkill(e.target.value)}
                                    placeholder="Add new skill"
                                    className="form-control"
                                    required
                                    disabled={isAdding}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isAdding || newSkill.trim() === ''}
                                >
                                    {isAdding ? 'Adding...' : 'Add Skill'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="col-md-6">
                        <form onSubmit={handleAddcourse}>
                            <div className="input-group">
                                <input
                                    type="text"
                                    value={newcourse}
                                    onChange={(e) => setNewcourse(e.target.value)}
                                    placeholder="Add new course"
                                    className="form-control"
                                    required
                                    disabled={isAdding}
                                />
                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={isAdding || newcourse.trim() === ''}
                                >
                                    {isAdding ? 'Adding...' : 'Add Course'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>

                {/* Loading state while fetching skills */}
                <div>
                <h2>Skills</h2>
                {loading ? (
                    <p>Loading skills...</p>
                ) : (
                    <ul className="list-group">
                        {skills.map(skill => (
                            <li key={skill._id} className="list-group-item d-flex justify-content-between align-items-center">
                                {skill.skillname}
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeleteSkill(skill._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                </div>
                

                {/* Loading state while fetching courses */}
                <div className='mt-3'>
                <h2>Courses</h2>
                {loading ? (
                    <p>Loading courses...</p>
                ) : (
                    <ul className="list-group mt-3">
                        {courses.map(course => (
                            <li key={course._id} className="list-group-item d-flex justify-content-between align-items-center">
                                {course.coursename}
                                <button
                                    className="btn btn-danger btn-sm"
                                    onClick={() => handleDeletecourse(course._id)}
                                >
                                    Delete
                                </button>
                            </li>
                        ))}
                    </ul>
                )}
                </div>
                
            </div>
        </Layout>
    );
};

export default AdminSkillManager;
