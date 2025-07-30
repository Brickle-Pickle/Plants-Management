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

export default mongoose.model('Plant', PlantSchema);