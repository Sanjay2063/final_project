import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Modal, Button, Form, Row, Col, Card, Table } from 'react-bootstrap';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
    const [employeeSkills, setEmployeeSkills] = useState([]); // Employee skills data
    const [skills, setSkills] = useState([]); // Skill names
    const [courses, setCourses] = useState([]); // Course names
    const [skillChartData, setSkillChartData] = useState(null); // Data for skill bar chart
    const [courseChartData, setCourseChartData] = useState(null); // Data for course bar chart
    const [skillsPerEmployeeChartData, setSkillsPerEmployeeChartData] = useState(null); // Data for skills per employee chart
    const [skillsPerDepartmentChartData, setSkillsPerDepartmentChartData] = useState(null); // Data for skills per department chart
    const [loading, setLoading] = useState(true); // Loading state
    const [showModal, setShowModal] = useState(false); // Modal visibility state
    const [selectedEmployee, setSelectedEmployee] = useState(null); // Selected employee's skills
    const [selectedSkill, setSelectedSkill] = useState(''); // Selected skill for filtering
    const [selectedCourse, setSelectedCourse] = useState(''); // Selected course for filtering

    useEffect(() => {
        setLoading(true); // Start loading
        // Fetch skills and courses first, then employee skills
        Promise.all([fetchSkills(), fetchCourses()])
            .then(() => fetchEmployeeSkills())
            .finally(() => setLoading(false)); // Stop loading after data is fetched
    }, []);

    useEffect(() => {
        // Only process chart data if skills and courses are fetched
        if (employeeSkills.length && skills.length) processSkillChartData(filteredEmployees);
        if (employeeSkills.length && courses.length) processCourseChartData(filteredEmployees);
        if (employeeSkills.length) {
            processSkillsPerEmployeeChartData(filteredEmployees);
            processSkillsPerDepartmentChartData(filteredEmployees);
        }
    }, [employeeSkills, skills, courses, selectedSkill, selectedCourse]);

    const fetchEmployeeSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/admin/approved-skills', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setEmployeeSkills(response.data);
        } catch (error) {
            console.error('Error fetching employee skills:', error);
        }
    };

    const fetchSkills = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/employee/skillname', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            const skillNames = response.data.map(skill => skill.skillname);
            setSkills(skillNames); // Store skill names for filtering chart data
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
            setCourses(courseNames); // Store course names for filtering chart data
        } catch (error) {
            console.error('Error fetching courses', error);
        }
    };

    const processSkillChartData = (data) => {
        const skillCount = {};
        data.forEach((employee) => {
            employee.skills.forEach((skill) => {
                if (skills.includes(skill.skillname)) {
                    skillCount[skill.skillname] = (skillCount[skill.skillname] || 0) + 1;
                }
            });
        });

        const labels = Object.keys(skillCount);
        const counts = Object.values(skillCount);

        setSkillChartData({
            labels,
            datasets: [
                {
                    label: 'Number of Employees with Skill',
                    data: counts,
                    backgroundColor: 'rgba(75, 192, 192, 0.6)',
                    borderColor: 'rgba(75, 192, 192, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    const processCourseChartData = (data) => {
        const courseCount = {};
        data.forEach((employee) => {
            employee.skills.forEach((skill) => {
                if (courses.includes(skill.coursename)) {
                    courseCount[skill.coursename] = (courseCount[skill.coursename] || 0) + 1;
                }
            });
        });

        const labels = Object.keys(courseCount);
        const counts = Object.values(courseCount);

        setCourseChartData({
            labels,
            datasets: [
                {
                    label: 'Number of Employees with Course',
                    data: counts,
                    backgroundColor: 'rgba(153, 102, 255, 0.6)',
                    borderColor: 'rgba(153, 102, 255, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    // Process the number of skills per employee
    const processSkillsPerEmployeeChartData = (data) => {
        const employeeSkillCounts = {};
        data.forEach((employee) => {
            employeeSkillCounts[employee.email] = employee.skills.length;
        });

        const labels = Object.keys(employeeSkillCounts);
        const counts = Object.values(employeeSkillCounts);

        setSkillsPerEmployeeChartData({
            labels,
            datasets: [
                {
                    label: 'Number of Skills per Employee',
                    data: counts,
                    backgroundColor: 'rgba(255, 99, 132, 0.6)',
                    borderColor: 'rgba(255, 99, 132, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    // Process the number of skills per department
    const processSkillsPerDepartmentChartData = (data) => {
        const departmentSkillCounts = {};
        data.forEach((employee) => {
            const department = employee.department || 'Unknown'; // Assuming employee has a 'department' field
            departmentSkillCounts[department] = (departmentSkillCounts[department] || 0) + employee.skills.length;
        });

        const labels = Object.keys(departmentSkillCounts);
        const counts = Object.values(departmentSkillCounts);

        setSkillsPerDepartmentChartData({
            labels,
            datasets: [
                {
                    label: 'Number of Skills per Department',
                    data: counts,
                    backgroundColor: 'rgba(54, 162, 235, 0.6)',
                    borderColor: 'rgba(54, 162, 235, 1)',
                    borderWidth: 1
                }
            ]
        });
    };

    const viewSkill = (employee) => {
        setSelectedEmployee(employee); // Set the selected employee
        setShowModal(true); // Show the modal
    };

    // Function to handle skill selection from the dropdown
    const handleSkillFilterChange = (e) => {
        setSelectedSkill(e.target.value);
    };

    // Function to handle course selection from the dropdown
    const handleCourseFilterChange = (e) => {
        setSelectedCourse(e.target.value);
    };

    // Filter employees based on the selected skill and course
    const filteredEmployees = employeeSkills.filter((employee) =>
        (selectedSkill === '' || employee.skills.some((skill) => skill.skillname === selectedSkill)) &&
        (selectedCourse === '' || employee.skills.some((skill) => skill.coursename === selectedCourse))
    );

    // Calculate totals for cards
    const totalEmployees = employeeSkills.length;
    const totalSkills = skills.length;
    const totalCourses = courses.length;

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <p>Manage employee skills</p>
            
            {loading ? (
                <p>Loading data, please wait...</p> // Show a loading message while data is being fetched
            ) : (
                <>
                    {/* Cards for Totals */}
                    <Row className="mb-4">
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Total Employees</Card.Title>
                                    <Card.Text>{totalEmployees}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Total Skills</Card.Title>
                                    <Card.Text>{totalSkills}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                        <Col md={4}>
                            <Card>
                                <Card.Body>
                                    <Card.Title>Total Courses</Card.Title>
                                    <Card.Text>{totalCourses}</Card.Text>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>

                    {/* Filter Row */}
                    <Row className="mb-4">
                        {/* Skill Dropdown Filter */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Filter by Skill</Form.Label>
                                <Form.Control as="select" value={selectedSkill} onChange={handleSkillFilterChange}>
                                    <option value="">All Skills</option>
                                    {skills.map((skill) => (
                                        <option key={skill} value={skill}>
                                            {skill}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>

                        {/* Course Dropdown Filter */}
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label>Filter by Course</Form.Label>
                                <Form.Control as="select" value={selectedCourse} onChange={handleCourseFilterChange}>
                                    <option value="">All Courses</option>
                                    {courses.map((course) => (
                                        <option key={course} value={course}>
                                            {course}
                                        </option>
                                    ))}
                                </Form.Control>
                            </Form.Group>
                        </Col>
                    </Row>

                    {/* Render Employee Table */}
                    <div className="table-responsive">
                        <Table striped bordered hover size="sm" className="text-center">
                            <thead className="thead-dark">
                                <tr>
                                    <th>#</th>
                                    <th>Email</th>
                                    <th>Skills</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredEmployees.map((employee, index) => (
                                    <tr key={index}>
                                        <td>{index + 1}</td>
                                        <td>{employee.email}</td>
                                        <td>{employee.skills.map((skill) => skill.skillname).join(', ')}</td>
                                        <td>
                                            <Button variant="primary" onClick={() => viewSkill(employee)}>
                                                View Skills
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Modal for Viewing Employee Skills */}
                    <Modal show={showModal} onHide={() => setShowModal(false)}>
                        <Modal.Header closeButton>
                            <Modal.Title>Skills of {selectedEmployee && selectedEmployee.email}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {selectedEmployee && (
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Skill Name</th>
                                            <th>Course Name</th>
                                            <th>Score</th>
                                            <th>Certificate Link</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedEmployee.skills.map((skill, index) => (
                                            <tr key={index}>
                                                <td>{skill.skillname}</td>
                                                <td>{skill.coursename}</td>
                                                <td>{skill.score}</td>
                                                <td><a href={skill.certificate_link} target="_blank" rel="noopener noreferrer">View Certificate</a></td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            )}
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => setShowModal(false)}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <div className='d-flex' style={{ width: '100%' }}>
                    {/* Skill Chart */}
                    {skillChartData && (
                        
                        <div className="mb-4" style={{ width: '50%' }}>
                            <h4>Skill Distribution</h4>
                            <Bar
                                data={skillChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: true, text: 'Employees per Skill' }
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Course Chart */}
                    {courseChartData && (
                        <div className="mb-4" style={{ width: '50%' }}>
                            <h4>Course Distribution</h4>
                            <Bar
                                data={courseChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: true, text: 'Employees per Course' }
                                    }
                                }}
                            />
                        </div>
                    )}
                    </div>

                    <div className='d-flex' style={{ width: '100%' }}>

                    {/* Skills per Employee Chart */}
                    {skillsPerEmployeeChartData && (
                        <div className="mb-4" style={{ width: '50%' }}>
                            <h4>Skills per Employee</h4>
                            <Bar
                                data={skillsPerEmployeeChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: true, text: 'Number of Skills per Employee' }
                                    }
                                }}
                            />
                        </div>
                    )}

                    {/* Skills per Department Chart */}
                    {skillsPerDepartmentChartData && (
                        <div className="mb-4" style={{ width: '50%' }}>
                            <h4>Skills per Department</h4>
                            <Bar
                                data={skillsPerDepartmentChartData}
                                options={{
                                    responsive: true,
                                    plugins: {
                                        legend: { position: 'top' },
                                        title: { display: true, text: 'Number of Skills per Department' }
                                    }
                                }}
                            />
                        </div>
                    )}
                    
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminDashboard;
