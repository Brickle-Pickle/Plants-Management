import User from '../models/Users.js';
import jwt from 'jsonwebtoken';

export const protect = async (req, res, next) => {
    let token;

    console.log('=== AUTH MIDDLEWARE ===');
    console.log('Authorization header:', req.headers.authorization);

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
        console.log('Token extracted:', token ? 'Token present' : 'No token');
    }

    if (!token) {
        console.log('No token provided');
        return res.status(401).json({ msg: 'Not authorized, no token' });
    }

    try {
        console.log('Verifying token...');
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log('Token decoded:', { id: decoded.id, exp: decoded.exp });
        
        console.log('Finding user by ID:', decoded.id);
        const user = await User.findById(decoded.id).select('-password');
        
        if (!user) {
            console.log('User not found in database');
            return res.status(401).json({ msg: 'User not found' });
        }
        
        console.log('User found:', { id: user._id, email: user.email });
        req.user = user;
        next();
    } catch (error) {
        console.error('Token verification failed:', error.message);
        return res.status(401).json({ msg: 'Not authorized, token failed' });
    }
};
