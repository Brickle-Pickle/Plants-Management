import mongoose from 'mongoose'

const CareRecordSchema = new mongoose.Schema({
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
    description: {
        type: String,
        default: ''
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    },
    completedAt: {
        type: Date,
        default: null
    },
    completed: {
        type: Boolean,
        default: false
    },
    notes: {
        type: String,
        default: ''
    },
    nextDueDate: {
        type: Date,
        default: null
    },
    frequency: {
        type: String,
        default: ''
    }
});

// Pre save (if the information is incomplete)
CareRecordSchema.pre('save', function(next) {
    if (!this.frequency) {
        this.frequency = 'monthly';
    }
    if (!this.nextDueDate) {
        this.nextDueDate = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
    }
    if (!this.completed) {
        this.completed = false;
    }
    if (!this.notes) {
        this.notes = '';
    }
    if (!this.completedAt) {
        this.completedAt = null;
    }
    if (!this.description) {
        this.description = '';
    }
    if (!this.careType) {
        this.careType = 'watering';
    }
    if (!this.plant) {
        this.plant = null;
    }
    if (!this.userId) {
        this.userId = null;
    }
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});

// Post save (after the document is saved)
CareRecordSchema.post('save', function(doc, next) {
    console.log('CareRecord saved:', doc);
    next();
});

// Create a function to get the nextDueDate based on frequency
function getNextDueDate(frequency) {
    const now = new Date();
    let nextDueDate;
    switch (frequency) {
        case 'daily':
            nextDueDate = new Date(now.getTime() + 24 * 60 * 60 * 1000);
            break;
        case 'weekly':
            nextDueDate = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
            break;
        case 'monthly':
            nextDueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            break;
        default:
            nextDueDate = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
            break;
    }
    return nextDueDate;
}

// Export the model
export default mongoose.model('CareRecord', CareRecordSchema);