const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

exports.registerUser = async (req, res) => {
    const { username, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ error: 'User already exists' });
        }

        const newUser = new User({ username, email, password });
        await newUser.save();

        const token = jwt.sign({ username: newUser.username }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.status(201).json({ 
            message: 'User registered successfully', 
            user: newUser, 
            token 
        });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ error: 'Failed to register user' });
    }
};

exports.loginUser = async (req, res) => {
    const { identifier, password } = req.body;

    try {
        const user = await User.findOne({
            $or: [{ email: identifier }, { username: identifier }]
        });

        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }

        const isMatch = await user.matchPassword(password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        const token = jwt.sign({ username: user.username }, process.env.JWT_SECRET, { expiresIn: '30d' });

        res.cookie('username', user.username, { httpOnly: false, maxAge: 30 * 24 * 60 * 60 * 1000 });

        res.status(200).json({ 
            message: 'Login successful', 
            user, 
            token 
        });
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ error: 'Failed to log in' });
    }
};


exports.updateProfile = async (req, res) => {
    const { username, interests, goals } = req.body;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        user.interests = interests;
        user.goals = goals;

        await user.save();

        res.status(200).json({ message: 'Profile updated successfully', user });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
};

exports.getProfile = async (req, res) => {
    const { username } = req.query;

    try {
        const user = await User.findOne({ username });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ interests: user.interests, goals: user.goals });
    } catch (error) {
        console.error('Error fetching profile:', error);
        res.status(500).json({ error: 'Failed to fetch profile' });
    }
};
