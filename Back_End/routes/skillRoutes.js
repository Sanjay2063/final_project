const express = require('express');
const {
  addSkill,
  updateSkill,
  getSkills,
  deleteSkill,
  getProfile,
  updatePassword,
} = require('../controllers/skillController');
const {
  addSkillName,
  getAllSkills,
  deleteSkillName,
  addCourseName,
  getAllCourses,
  deleteCourseName,
} = require('../controllers/SkillNameController');
const authenticateToken = require('../middlewares/authMiddleware');
const {
  getAllEmployeeSkills,
  getPendingSkills,
  approveSkill,
  rejectSkill,
  getApprovedSkills,
  getAllEmployees,
  deleteUser
} = require('../controllers/adminController');
const router = express.Router();

// Employee Routes
router.post('/employee/skills', authenticateToken, addSkill);
router.put('/employee/skills', authenticateToken, updateSkill);
router.get('/employee/skills', authenticateToken, getSkills);
router.get('/employee/profile', authenticateToken, getProfile);
router.put('/employee/password', authenticateToken, updatePassword);

// Skill Name Routes
router.post('/employee/skillname', authenticateToken, addSkillName);
router.delete('/employee/skillname/:skillId', authenticateToken, deleteSkillName);
router.get('/employee/skillname', authenticateToken, getAllSkills);

// Course Name Routes
router.post('/employee/coursename', authenticateToken, addCourseName);
router.delete('/employee/coursename/:skillId', authenticateToken, deleteCourseName);
router.get('/employee/coursename', authenticateToken, getAllCourses);

// Admin Routes
router.get('/admin/employee-skills', authenticateToken, getAllEmployeeSkills);
router.get('/users', authenticateToken, getAllEmployees);
router.delete('/employee/skills/:index', authenticateToken, deleteSkill);
router.delete('/users/:userId', authenticateToken, deleteUser);
router.get('/admin/pending-skills', authenticateToken, getPendingSkills);
router.put('/admin/approve-skill/:skillId', authenticateToken, approveSkill);
router.put('/admin/reject-skill/:skillId', authenticateToken, rejectSkill);
router.get('/admin/approved-skills', authenticateToken, getApprovedSkills);

module.exports = router;
