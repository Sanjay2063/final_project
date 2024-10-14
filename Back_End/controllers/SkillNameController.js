// controllers/skillNameController.js
const SkillName = require('../models/Skillname');
const CourseName = require('../models/courseName');
// Add a new skill name (for admin use only)
exports.addSkillName = async (req, res) => {
    try {
        const { skillname } = req.body;
        console.log(skillname)
        // Check if the skill already exists
        const existingSkill = await SkillName.findOne({ skillname });
        if (existingSkill) {
            return res.status(400).json({ message: 'Skill name already exists' });
        }

        const newSkill = new SkillName({ skillname });
        await newSkill.save();
        return res.status(201).json({ message: 'Skill name added successfully', skill: newSkill });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding skill name', error });
    }
};

// Delete a skill name (for admin use only)
exports.deleteSkillName = async (req, res) => {
    try {
        const { skillId } = req.params;

        const deletedSkill = await SkillName.findByIdAndDelete(skillId);
        if (!deletedSkill) {
            return res.status(404).json({ message: 'Skill name not found' });
        }

        return res.status(200).json({ message: 'Skill name deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting skill name', error });
    }
};

// Get the list of all skill names
exports.getAllSkills = async (req, res) => {
    try {
        const skills = await SkillName.find({});
        return res.status(200).json(skills);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching skill names', error });
    }
};




// Add a new course name (for admin use only)
exports.addCourseName = async (req, res) => {
    try {
        const { coursename } = req.body;

        // Check if the course already exists
        const existingCourse = await CourseName.findOne({ coursename });
        if (existingCourse) {
            return res.status(400).json({ message: 'Course name already exists' });
        }

        const newCourse = new CourseName({ coursename });
        await newCourse.save();
        return res.status(201).json({ message: 'Course name added successfully', course: newCourse });
    } catch (error) {
        return res.status(500).json({ message: 'Error adding course name', error });
    }
};

// Delete a course name (for admin use only)
exports.deleteCourseName = async (req, res) => {
    try {
        const { courseId } = req.params;

        const deletedCourse = await CourseName.findByIdAndDelete(courseId);
        if (!deletedCourse) {
            return res.status(404).json({ message: 'Course name not found' });
        }

        return res.status(200).json({ message: 'Course name deleted successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error deleting course name', error });
    }
};

// Get the list of all course names
exports.getAllCourses = async (req, res) => {
    try {
        const courses = await CourseName.find({});
        return res.status(200).json(courses);
    } catch (error) {
        return res.status(500).json({ message: 'Error fetching course names', error });
    }
};





