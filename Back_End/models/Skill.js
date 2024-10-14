const mongoose = require('mongoose');

// Define the schema for individual skills
const SkillDetailSchema = new mongoose.Schema({
    skillname: {
        type: String,
        required: true
    },
    coursename: {
        type: String,
        required: true
    },
    certificate_link: {
        type: String,
        required: false // Optional if not all skills have certificates
    },
    score: {
        type: Number,
        required: true
    },
    approval: { 
        type: Boolean, 
        default: null // Default to null to indicate pending approval
    } 
});

// Define the schema for employee skills
const SkillSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    skills: {
        type: [SkillDetailSchema], // Array of skill objects
        required: true
    }
});

module.exports = mongoose.model('Skill', SkillSchema);
