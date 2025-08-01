import CareRecords from '../models/CareRecords.js'
import express from 'express'
import mongoose from 'mongoose'
import { protect } from '../middleware/authMiddleware.js'
import Plants from '../models/Plants.js'

export const createCareRecord = async (req, res) => {
    try {
        console.log('=== CREATE CARE RECORD REQUEST ===');
        console.log('Method:', req.method);
        console.log('Path:', req.path);
        console.log('Body:', req.body);
        console.log('User from middleware:', req.user);
        
        // Get user ID from middleware (req.user is set by protect middleware)
        const userId = req.user._id;
        
        // Destructure and validate required fields
        const { plantId, frequency, lastDueDate, nextDueDate, notes } = req.body;
        
        // Validate required fields
        if (!plantId || !plantId.trim()) {
            return res.status(400).json({ msg: 'Plant ID is required' });
        }
        
        if (!frequency || !frequency.trim()) {
            return res.status(400).json({ msg: 'Frequency is required' });
        }
        
        // Create care record data with correct ObjectId
        const careRecordData = {
            userId: userId, // This is already an ObjectId from the middleware
            plantId: mongoose.Types.ObjectId(plantId.trim()),
            frequency: frequency.trim(),
            lastDueDate: lastDueDate ? new Date(lastDueDate) : null,
            nextDueDate: nextDueDate ? new Date(nextDueDate) : null,
            notes: notes || ''
        };
        
        // Create and save the care record
        const careRecord = new CareRecords(careRecordData);
        await careRecord.save();
        
        console.log('Care record saved successfully:', careRecord);
        res.status(201).json(careRecord);
        
    } catch (error) {
        console.error('Error creating care record:', error);
        res.status(500).json({ msg: 'Server error' });
    }
}

export const getCareRecord = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ msg: 'User not authenticated' });
        }
        
        if (!req.params.id) {
            return res.status(400).json({ msg: 'Plant ID is required' });
        }

        const plant = await Plants.findById(req.params.id);
        if (!plant) {
            return res.status(404).json({ msg: 'Plant not found' });
        }

        const careRecords = await CareRecords.find({
            plantId: req.params.id
        });
        if (!careRecords) {
            return res.status(404).json({ msg: 'Care record not found' });
        }

        res.status(200).json(careRecords);
    } catch (error) {
        console.error('Error fetching care record:', error);
        res.status(500).json({ msg: 'Server error' });
    }
}

const router = express.Router();
// Apply protect middleware to both routes
router.post('/', protect, createCareRecord);
router.get('/:id', protect, getCareRecord);
export default router;