const mongoose = require("mongoose");

const RequestSchema = new mongoose.Schema({
    requesterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    guestName: String,
    guestEmail: String,

    targetUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },

    requestType: { 
        type: String, 
        enum: [
            'Timetable Conflict',   
            'Clock-in Error',       
            'Client Issue',         
            'Personal Detail Change',
            'General Complaint',    
            'System Bug',
            'Inquiry', 
            'Other'          
        ],
        required: true
    },
    
    otherDetails: { type: String },
    details: { type: String, required: true },
    status: { 
        type: String, 
        enum: ['Pending', 'Resolved'], 
        default: 'Pending' 
    },
    adminNotes: String, 
    createdAt: { type: Date, default: Date.now } 
});

module.exports = mongoose.model("Request", RequestSchema);