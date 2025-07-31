import mongoose from "mongoose";

const PlantSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    species: {
        type: String,
        required: true
    },
    location: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        default: 'https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883334/avatar/avatar_10000.png'
    },
    info: {
        status: {
            type: String,
            enum: ['healthy', 'needsWater', 'needsAttention', 'sick'],
            default: 'healthy'
        },
        lastWatering: { type: Date },
        nextWatering: { 
            type: Date, 
            required: true 
        },
        notes: { type: String }
    },
    createdAt: {
        type: Date,
        default: Date.now,
        required: true
    }
});

// Add a pre-save middleware to set nextWatering if not provided
PlantSchema.pre('save', function(next) {
    if (!this.info.nextWatering) {
        this.info.nextWatering = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days from now
    }
    next();
});

// Add a pre-save middleware to set lastWatering if not provided
PlantSchema.pre('save', function(next) {
    if (!this.info.lastWatering) {
        this.info.lastWatering = new Date(Date.now());
    }
    next();
});

// Add a pre-save middleware to set status if not provided
PlantSchema.pre('save', function(next) {
    if (!this.info.status) {
        this.info.status = 'healthy';
    }
    next();
});

// Add a pre-save middleware to set notes if not provided
PlantSchema.pre('save', function(next) {
    if (!this.info.notes) {
        this.info.notes = '';
    }
    next();
});

// Add a pre-save middleware to set createdAt if not provided
PlantSchema.pre('save', function(next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});

export default mongoose.model('Plant', PlantSchema);