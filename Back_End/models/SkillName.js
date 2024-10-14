const mongoose = require('mongoose');

// Define the global skill name schema
const skillNameSchema = new mongoose.Schema({
    skillname: {
        type: String,
        required: true,
        unique: true // Ensures that the skill name is unique across the system
    }
});

module.exports = mongoose.model('SkillName', skillNameSchema);