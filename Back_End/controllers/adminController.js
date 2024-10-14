const Skill = require('../models/Skill');
const User = require('../models/User');

// Controller to get all employees and their skills
exports.getAllEmployeeSkills = async (req, res) => {
    
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }

    try {
        // Find all skills along with user information (populate both name and email)
        const employeeSkills = await Skill.find().populate('userId', 'name email'); // Include both 'name' and 'email'

        if (!employeeSkills) {
            return res.status(404).json({ message: 'No employee skills found' });
        }

        // Map the response to include employee names, emails, and skills
        const formattedEmployeeSkills = employeeSkills.map(emp => ({
            id: emp.userId._id,
            name: emp.userId.name,
            email: emp.userId.email, // Include the email
            skills: emp.skills.map(skill => ({ skillname: skill.skillname })) // Ensure we get skill names
        }));

        res.json(formattedEmployeeSkills);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.getPendingSkills = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    try {
        // Find skills with pending approval (where approval is null)
        const employees = await Skill.find({ 'skills.approval': null })
            .populate('userId', 'email') // Populate the userId with email from the User model
            .select('skills userId'); // Select skills and userId (for email)

        if (!employees || employees.length === 0) {
            return res.status(200).send([]); // Send an empty array if no pending skills
        }

        // Structure the response to return email and pending skills
        const pendingSkills = employees.map(employee => ({
            email: employee.userId.email, // Extract the email from populated userId
            skills: employee.skills.filter(skill => skill.approval === null) // Filter skills with null approval
        }));

        res.json(pendingSkills); // Send the response with email and pending skills
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};



// Controller to approve a skill
exports.approveSkill = async (req, res) => {
    /*if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }*/
        if (req.user.role !== 'admin') {
            return res.status(403).send('Access denied');
        }

    const { skillId } = req.params;

    try {
        const skill = await Skill.findOneAndUpdate(
            { 'skills._id': skillId },  // Find the skill by its _id
            { $set: { 'skills.$.approval': true } },  // Approve the specific skill
            { new: true }  // Return the updated document
        );

        if (!skill) {
            return res.status(404).send('Skill not found');
        }

        res.send('Skill approved');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};



// Controller to reject a skill
exports.rejectSkill = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }

    const { skillId } = req.params;

    try {
        const skill = await Skill.findOneAndUpdate(
            { 'skills._id': skillId }, 
             // Find the skill by its _id
            { $set: { 'skills.$.approval': false } },  // Reject the specific skill
            { new: true }  // Return the updated document
        );

        if (!skill) {
            return res.status(404).send('Skill not found');
        }

        res.send('Skill rejected');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.getApprovedSkills = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }
    try {
        // Find skills that are approved
        const employees = await Skill.find({ 'skills.approval': true })
            .populate('userId', 'email department')// Populate the userId with email from the User model
            .select('skills userId'); // Select skills and userId (for email)

        if (!employees || employees.length === 0) {
            return res.status(200).send([]); // Send an empty array if no approved skills
        }

        // Structure the response to return email and approved skills
        const approvedSkills = employees.map(employee => {
            if (!employee.userId) {
                // If userId is null, skip this employee
                return null;
            }

            return {
                email: employee.userId.email,
                department: employee.userId.department, // Extract the email from populated userId
                skills: employee.skills.filter(skill => skill.approval === true) // Filter skills with approval set to true
            };
        }).filter(emp => emp !== null); // Remove any null entries from the array

        res.json(approvedSkills); // Send the response with email and approved skills
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

exports.getAllEmployees = async (req, res) => {
    try {
        // Fetch all users with role 'employee'
        const employees = await User.find({ role: 'employee' }).select('email department role');

        if (!employees || employees.length === 0) {
            return res.status(404).json({ message: 'No employees found' });
        }

        // Respond with the list of employees
        res.json(employees);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteUser = async (req, res) => {
    // Check if the user has admin privileges
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }

    const { userId } = req.params; // Expecting the user ID to be in the URL parameters

    try {
        // Find and delete the user by their ID
        const deletedUser = await User.findByIdAndDelete(userId);

        if (!deletedUser) {
            return res.status(404).send('User not found');
        }

        res.send('User deleted successfully');
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};