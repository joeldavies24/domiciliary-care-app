const mongoose = require("mongoose");

const CarePlanSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    emergencyContacts: [{
        name: String,
        relation: String,
        mobile: String
    }],

    medicalHistory: [{
        condition: String,
        notes: String,
        dateAdded: { type: Date, default: Date.now }
    }],
    
    allergies: [String],

    dietaryRequirements: [String],
    mobilityRestrictions: String, 

    incidents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Incident' 
    }],

    routines: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Routine'
    }],

    lastReviewDate: { type: Date, default: Date.now },
    adminNotes: String 
});

module.exports = mongoose.model("CarePlan", CarePlanSchema);