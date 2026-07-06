const mongoose = require("mongoose");

const VisitSchema = new mongoose.Schema({

    carerId: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    ],
    clientId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    date: {
        type: String,
        required: true
    },
    scheduledStart: {
        type: String,
        required: true
    },
    scheduledEnd: {
        type: String,
        required: true
    },
    checkInLocation: {
        latitude: { type: Number },
        longitude: { type: Number }
    },
    checkIn: Date,
    checkOut: Date,
    visitNotes: String,
    clientFeeling: {
        type: String,
        enum: ["bad", "sad", "okay", "good", "great"]
    },
    tasks: [
        {
            task: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Task"
            },

            completed: {
                type: Boolean,
                default: false
            }
        }
    ]

});

module.exports = mongoose.model("Visit", VisitSchema);