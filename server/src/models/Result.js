import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    type: {
        type: String,
        enum: ['Interview', 'MCQ'],
        required: true,
    },
    score: {
        type: Number,
        required: true,
    },
    totalScore: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    skill: {
        type: String,
    },
    difficulty: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Result', resultSchema);
