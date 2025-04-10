const User = require('../models/User');
const generateToken = require('../utils/generateToken');

// REGISTER USER
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User already exists' });

        const user = await User.create({ name, email, password });
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'User created successfully',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar,
                createdAt: user.createdAt
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// LOGIN USER
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = generateToken(user._id);

        res.json({
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                avatar: user.avatar
            },
            token
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

module.exports = { registerUser, loginUser };
