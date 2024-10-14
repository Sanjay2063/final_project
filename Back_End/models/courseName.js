const mongoose = require('mongoose');

// Define the global course name schema
const courseNameSchema = new mongoose.Schema({
    coursename: {
        type: String,
        required: true,
        unique: true // Ensures that the course name is unique across the system
    }
});

module.exports = mongoose.model('CourseName', courseNameSchema);
