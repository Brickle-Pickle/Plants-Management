import mongoose from "mongoose";

const ReminderSchema = new mongoose.Schema({
    plantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Plant',
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    careType: {
        type: String,
        enum: ['watering', 'fertilizing', 'pruning', 'repotting'],
        required: true
    },
    scheduleDate: {
        type: Date,
        required: true
    },
    isRecurring: {
        type: Boolean,
        default: false
    },
    frequency: {
        type: Number,
        default: 0
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'overdue'],
        default: 'pending'
    },
    notificationSent: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    updatedAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

ReminderSchema.pre('save', function(next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    if (!this.updatedAt) {
        this.updatedAt = new Date();
    }
    if (this.isRecurring && !this.frequency) {
        this.frequency = 1;
    }
    next();
});

export default mongoose.model('Reminder', ReminderSchema);