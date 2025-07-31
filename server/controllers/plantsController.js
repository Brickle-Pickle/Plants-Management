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

export const getUserPlants = async (req, res) => {
    try {
        console.log('=== GET USER PLANTS REQUEST ===');
        console.log('Headers:', req.headers);
        console.log('User from middleware:', req.user);
        console.log('User ID:', req.user?._id);
        console.log('User ID type:', typeof req.user?._id);
        
        // Check if user exists in request
        if (!req.user || !req.user._id) {
            console.log('User not authenticated - no user in request');
            return res.status(401).json({ msg: 'User not authenticated' });
        }
        
        const userId = req.user._id;
        console.log('Searching for plants with userId:', userId);
        
        // Try to find plants for this user with detailed logging
        const plants = await Plant.find({ userId: userId });
        console.log('Query result - Found plants:', plants.length);
        
        if (plants.length === 0) {
            console.log('No plants found for user:', userId);
            // Let's also check if there are any plants in the database at all
            const totalPlants = await Plant.countDocuments();
            console.log('Total plants in database:', totalPlants);
            
            if (totalPlants > 0) {
                // Check what userIds exist in the database
                const existingUserIds = await Plant.distinct('userId');
                console.log('Existing userIds in plants collection:', existingUserIds);
                console.log('Current user ID comparison:', {
                    currentUserId: userId,
                    currentUserIdString: userId.toString(),
                    existingIds: existingUserIds.map(id => id.toString())
                });
            }
        } else {
            console.log('Plants found:', plants.map(p => ({ id: p._id, name: p.name, userId: p.userId })));
        }
        
        res.status(200).json(plants);
    } catch (error) {
        console.error('=== ERROR FETCHING PLANTS ===');
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ msg: 'Error fetching plants: ' + error.message });
    }
}

export const deletePlant = async (req, res) => {
    try {
        // Validate plant ID
        if (!req.params.id || !mongoose.Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ msg: 'Invalid plant ID' });
        }
        
        // Find the plant first to check ownership
        const plant = await Plant.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ msg: 'Plant not found' });
        }
        
        // Check if the plant belongs to the authenticated user
        if (plant.userId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ msg: 'Not authorized to delete this plant' });
        }
        
        // Delete the plant
        await Plant.findByIdAndDelete(req.params.id);
        
        // Send success response
        res.status(200).json({ 
            msg: 'Plant deleted successfully', 
            deletedPlant: plant 
        });
        
    } catch (error) {
        console.error('=== ERROR DELETING PLANT ===');
        console.error('Error details:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({ msg: 'Error deleting plant: ' + error.message });
    }
}

const router = express.Router();

// Add test route (no auth needed)
router.get('/test', testRoute);

// Protect the create route with authentication middleware
router.post('/create', protect, createPlant);

// Add route to get user's plants
router.get('/user-plants', protect, getUserPlants);

// Add route to delete a plant
router.delete('/:id', protect, deletePlant);

export default router;