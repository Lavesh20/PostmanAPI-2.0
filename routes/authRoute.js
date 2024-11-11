const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const { body } = require('express-validator');

router.post('/register', [
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('name').notEmpty(),
    body('role').isIn(['patient', 'doctor', 'admin'])
], async (req, res) => {
    try {
        const { email, password, name, role } = req.body;
        const userExists = await User.findOne({ email });
        
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const user = new User({ email, password, name, role });
        await user.save();

        const token = user.generateAuthToken();
        res.status(201).json({ token, user: { id: user._id, name, email, role } });
    } catch (error) {
        res.status(500).json({ message: 'Error in registration', error: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || !await user.comparePassword(password)) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = user.generateAuthToken();
        res.json({ token, user: { id: user._id, name: user.name, email, role: user.role } });
    } catch (error) {
        res.status(500).json({ message: 'Error in login', error: error.message });
    }
});

module.exports = router;