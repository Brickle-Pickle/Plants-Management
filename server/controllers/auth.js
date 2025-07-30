import User from '../models/Users.js';
import jwt from 'jsonwebtoken';
import express from 'express';
import { registerSchema, loginSchema } from '../validators/authValidator.js';

export const register = async (req, res) => {
    const { email, password } = req.body;
    const { error } = registerSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }
    
    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' })
        }

        user = new User ({
            email,
            password
        });
        await user.save();

        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );

        res.status(201).json({ token });
    } catch (error) {
        res.status(500).json({ msg: 'Registration error: ' + error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    const { error } = loginSchema.validate(req.body);

    if (error) {
        return res.status(400).json({ msg: error.details[0].message });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid credentials' });
        }
        const token = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: process.env.JWT_EXPIRE }
        );
        res.status(200).json({ token });
        // res.status(200).json({ msg: 'Login successful' });
    } catch (error) {
        res.status(500).json({ msg: 'Login error: ' + error.message });
    }
};

export const profile = async (req, res) => {
    const token = req.headers.authorization.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ msg: 'Profile error: ' + error.message });
    }
}

const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', profile);

export default router;