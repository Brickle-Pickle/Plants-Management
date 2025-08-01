import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import authRoutes from './controllers/auth.js';
import plantsRoutes from './controllers/plantsController.js';
import careRecordsRoutes from './controllers/careRecordsController.js';
import streamAndUpload from './controllers/cloudinaryController.js'; // Fixed import

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(express.json());

app.use(cors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// app Routes
app.use('/api/auth', authRoutes);
app.use('/api/plants', plantsRoutes);
app.use('/api/careRecords', careRecordsRoutes);
// app External apis
app.post('/api/upload', streamAndUpload); 

app.get('/', (req, res) => {
    res.send('Plant management system working!');
})

// Connect to MongoDB first, then start server
const connectDB = async () => {
    try {
        console.log('Attempting to connect to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Successfully connected to MongoDB Atlas');
        
        // Start server only after successful DB connection
        app.listen(port, () => {
            console.log(`🚀 Server is running on port ${port}`);
        });
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err);
});

// Start the application
connectDB();