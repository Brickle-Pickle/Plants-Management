import Plant from '../models/Plants.js'
import express from 'express'
import mongoose from 'mongoose'
import { protect } from '../middleware/authMiddleware.js' // Add this import

// Test route to verify the controller is working
export const testRoute = (req, res) => {
    res.json({ message: 'Plants controller is working!', method: req.method, path: req.path });
}

export const createPlant = async (req, res) => {
    try {
        console.log('=== CREATE PLANT REQUEST ===');
        console.log('Method:', req.method);
        console.log('Path:', req.path);
        console.log('Body:', req.body);
        console.log('User from middleware:', req.user);
        
        // Get user ID from middleware (req.user is set by protect middleware)
        const userId = req.user._id;
        
        // Destructure and validate required fields
        const { name, species, location, status, lastWatered, nextWatering, notes, image } = req.body;
        
        // Validate required fields
        if (!name || !name.trim()) {
            return res.status(400).json({ msg: 'Plant name is required' });
        }
        
        if (!species || !species.trim()) {
            return res.status(400).json({ msg: 'Plant species is required' });
        }
        
        if (!location || !location.trim()) {
            return res.status(400).json({ msg: 'Plant location is required' });
        }

        // Create plant data with correct ObjectId
        const plantData = {
            userId: userId, // This is already an ObjectId from the middleware
            name: name.trim(),
            species: species.trim(),
            location: location.trim(),
            photo: image || 'https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883334/avatar/avatar_10000.png',
            info: {
                status: status || 'healthy',
                lastWatering: lastWatered ? new Date(lastWatered) : null,
                nextWatering: nextWatering ? new Date(nextWatering) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
                notes: notes || ''
            }
        };

        console.log('Plant data to save:', plantData);

        // Create and save the plant
        const plant = new Plant(plantData);
        await plant.save();
        
        console.log('Plant saved successfully:', plant);
        res.status(201).json(plant);
        
    } catch (error) {
        console.error('=== ERROR CREATING PLANT ===');
        console.error('Error details:', error);
        
        // Handle validation errors specifically
        if (error.name === 'ValidationError') {
            const validationErrors = Object.values(error.errors).map(err => err.message);
            return res.status(400).json({ 
                msg: 'Validation error: ' + validationErrors.join(', '),
                errors: validationErrors 
            });
        }
        
        // Handle other errors
        res.status(400).json({ msg: 'Error creating plant: ' + error.message });
    }
}

const router = express.Router();

// Add test route (no auth needed)
router.get('/test', testRoute);

// Protect the create route with authentication middleware
router.post('/create', protect, createPlant);

export default router;