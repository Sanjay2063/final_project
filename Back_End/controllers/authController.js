const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
    const { email, password, role, department } = req.body;

    
    // Validate role
    if (!['admin', 'employee'].includes(role)) {
        return res.status(400).send('Invalid role');
    }

    // Input validation
    if (!email || !password || !department) {
        return res.status(400).send('Email, password, and department are required');
    }

    try {
        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).send('User already exists'); // Conflict
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ email, password: hashedPassword, role, department });
        await user.save();
        res.status(201).send('User created');
    } catch (error) {
        console.error('Error during signup:', error);
        res.status(500).send('Server error'); // Internal Server Error
    }
};


exports.login = async (req, res) => {
    const { email, password } = req.body;

    // Input validation
    if (!email || !password) {
        return res.status(400).send('Email and password are required');
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).send('Invalid credentials'); // Generic message

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).send('Invalid credentials'); // Generic message

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
        res.json({ token, role: user.role });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Server error'); // Internal Server Error
    }
};
