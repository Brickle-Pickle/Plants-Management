import Reminders from "../models/Reminders.js";
import express from 'express'
import mongoose from "mongoose";
import { protect } from "../middleware/authMiddleware.js";

export const createReminder = async (req, res) => {
    try {
        console.log('=== CREATE REMINDER REQUEST ===');
        console.log('Body:', req.body);
        console.log('User:', req.user);
        
        const { plantId, careType, scheduledDate, isRecurring, frequency } = req.body;
        const userId = req.user._id;
        
        // Validate required fields
        if (!plantId || !careType || !scheduledDate) {
            return res.status(400).json({ msg: 'Missing required fields' });
        }
        
        const reminderData = {
            userId: new mongoose.Types.ObjectId(userId),
            plantId: new mongoose.Types.ObjectId(plantId),
            careType: careType.trim(),
            scheduleDate: new Date(scheduledDate), // Note: scheduleDate not scheduledDate
            isRecurring: isRecurring || false,
            frequency: isRecurring ? (frequency || 1) : 0,
            status: 'pending',
            notificationSent: false
        };
        
        const reminder = new Reminders(reminderData);
        await reminder.save();
        
        console.log('Reminder created successfully:', reminder);
        res.status(201).json(reminder);
    } catch (error) {
        console.error('Error creating reminder:', error);
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
}

export const getReminders = async (req, res) => {
    try {
        const userId = req.user._id;
        const reminders = await Reminders.find({ userId });
        res.status(200).json(reminders);
    } catch (error) {
        console.error('Error fetching reminders:', error);
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
}

export const updateReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updatedReminder = await Reminders.findByIdAndUpdate(id, updateData, { new: true });
        if (!updatedReminder) {
            return res.status(404).json({ msg: 'Reminder not found' });
        }
        res.status(200).json(updatedReminder);
    } catch (error) {
        console.error('Error updating reminder:', error);
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
}

export const deleteReminder = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedReminder = await Reminders.findByIdAndDelete(id);
        if (!deletedReminder) {
            return res.status(404).json({ msg: 'Reminder not found' });
        }
        res.status(200).json({ msg: 'Reminder deleted successfully' });
    } catch (error) {
        console.error('Error deleting reminder:', error);
        res.status(500).json({ msg: 'Server error: ' + error.message });
    }
}

const router = express.Router()
router.post('/create', protect, createReminder)
router.get('/', protect, getReminders)
router.put('/:id', protect, updateReminder)
router.delete('/:id', protect, deleteReminder)
export default router