const express = require('express');
const connectDB = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const skillRoutes = require('./routes/skillRoutes');

const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use('/api', authRoutes);
app.use('/api', skillRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
