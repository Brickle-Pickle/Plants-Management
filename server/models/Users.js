import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/diqqf3eq2/image/upload/v1586883334/avatar/avatar_10000.png'
    },
    preferences: {
        notifications: {
            type: Boolean, 
            default: true
        },
        reminderTime: {
            type: String,
            default: '18:00'
        },
        timezone: {
            type: String,
            default: 'UTC'
        }
    }
}, {
    timestamps: true
});

// Hash password
UserSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Compare passwords
UserSchema.methods.comparePassword = async function(candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model('User', UserSchema);