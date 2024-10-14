const Skill = require('../models/Skill');
const User = require('../models/User');
const bcrypt = require('bcrypt');
// Controller to add a new skill to an employee's skills
exports.addSkill = async (req, res) => {
    if (req.user.role !== 'employee') {
        return res.status(403).send('Access denied');
    }

    const { skillname, coursename, certificate_link, score } = req.body;

    // Check if all required fields are provided
    if (!skillname || !coursename || !certificate_link || !score) {
        return res.status(400).send('All skill fields are required');
    }

    const newSkill = { skillname, coursename, certificate_link, score };

    try {
        let employeeSkills = await Skill.findOne({ userId: req.user.id });

        if (employeeSkills) {
            // If skills already exist, add the new skill to the array
            employeeSkills.skills.push(newSkill);
            await employeeSkills.save();
            console.log("Skill added successfully");
        } else {
            // If no skills exist, create a new skill entry for the employee
            employeeSkills = new Skill({ userId: req.user.id, skills: [newSkill] });
            await employeeSkills.save();
            console.log("New skill entry created");
        }

        res.json(employeeSkills);
    } catch (error) {
        console.error("Error adding skill:", error);
        res.status(500).send('Server error');
    }
};

// Controller to update a specific skill
exports.updateSkill = async (req, res) => {
    if (req.user.role !== 'employee') {
        return res.status(403).send('Access denied');
    }

    const { skillIndex, skillname, coursename, certificate_link, score } = req.body;

    if (!skillname || !coursename || !certificate_link || !score) {
        return res.status(400).send('All fields are required to update the skill');
    }

    try {
        let employeeSkills = await Skill.findOne({ userId: req.user.id });

        if (employeeSkills) {
            // Check if the skill exists by index
            if (employeeSkills.skills[skillIndex]) {
                employeeSkills.skills[skillIndex] = { skillname, coursename, certificate_link, score };
                await employeeSkills.save();
                return res.json({ skills: employeeSkills.skills });
            } else {
                return res.status(404).send('Skill not found at the given index');
            }
        } else {
            return res.status(404).send('Skills not found');
        }
    } catch (error) {
        console.error("Error updating skill:", error);
        res.status(500).send('Server error');
    }
};

// Controller to get skills
exports.getSkills = async (req, res) => {
    if (req.user.role !== 'employee') {
        return res.status(403).send('Access denied');
    }

    try {
        const employeeSkills = await Skill.findOne({ userId: req.user.id });

        if (!employeeSkills) {
            return res.status(404).json({ message: 'No skills found' });
        }

        res.json({ skills: employeeSkills.skills });
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).send('Server error');
    }
};

exports.getProfile = async (req, res) => {
    if (req.user.role !== 'employee') {
        return res.status(403).send('Access denied');
    }
    
    try {
        const employee = await User.findOne({ _id: req.user.id });
        
        
        if (!employee) {
            return res.status(404).json({ message: 'No data found' });
        }

        res.json({ user: employee });
    } catch (error) {
        console.error("Error fetching skills:", error);
        res.status(500).send('Server error');
    }
    
};

exports.updatePassword = async (req, res) => {
    if (req.user.role !== 'employee') {
        return res.status(403).send('Access denied');
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
        return res.status(400).send('All fields are required to update the password');
    }

    // try {
    //     let employee = await User.findOne({ _id: req.user.id });

    //     if (employee) {
    //         // Check if the skill exists by index
    //         if (employeeSkills.skills[skillIndex]) {
    //             employeeSkills.skills[skillIndex] = { skillname, coursename, certificate_link, score };
    //             await employeeSkills.save();
    //             return res.json({ skills: employeeSkills.skills });
    //         } else {
    //             return res.status(404).send('Skill not found at the given index');
    //         }
    //     } else {
    //         return res.status(404).send('user not found');
    //     }
    // } 
    

    try {
        const user = await User.findById(req.user.id);
        if (!user) return res.status(404).send('User not found');

        // Compare current password
        const isMatch = await bcrypt.compare(currentPassword, user.password);
        if (!isMatch) return res.status(400).send('Current password is incorrect');

        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();

        res.status(200).send('Password changed successfully');
    } catch (error) {
        console.error('Error changing password:', error);
        res.status(500).send('Server error');
    }
};

// Controller to delete a skill
exports.deleteSkill = async (req, res) => {
    if (req.user.role !== 'employee') {
        return res.status(403).send('Access denied');
    }

    const skillIndex = req.params.index;

    try {
        let employeeSkills = await Skill.findOne({ userId: req.user.id });

        if (employeeSkills) {
            employeeSkills.skills.splice(skillIndex, 1); // Remove the skill at the index
            await employeeSkills.save();
            res.json({ skills: employeeSkills.skills });
        } else {
            return res.status(404).send('Skills not found');
        }
    } catch (error) {
        console.error('Error deleting skill:', error);
        res.status(500).send('Server error');
    }
};

exports.getPendingSkills = async (req, res) => {
    if (req.user.role !== 'admin') {
        return res.status(403).send('Access denied');
    }

    try {
        const pendingSkills = await Skill.find({ 'skills.approval': null }).populate('userId', 'name email');
        res.json(pendingSkills);
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
};

