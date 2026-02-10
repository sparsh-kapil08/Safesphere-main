
import mongoose, { Schema, model, models } from 'mongoose';

const LogSchema = new Schema({
    type: {
        type: String,
        enum: ['SOS', 'LOCATION_SHARE', 'VOICE_SOS', 'FAKE_CALL'],
        required: true,
    },
    userId: {
        type: String, // Mock user ID for now
        default: 'anonymous',
    },
    details: {
        type: String,
    },
    timestamp: {
        type: Date,
        default: Date.now,
    },
    location: {
        lat: Number,
        lng: Number,
    }
}, {
    timestamps: true,
});

const Log = models.Log || model('Log', LogSchema);

export default Log;
