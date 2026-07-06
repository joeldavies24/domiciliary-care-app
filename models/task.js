const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    taskName: String,
    category: { 
        type: String, 
        enum: ['Medication', 'Personal Care', 'Health Check', 'Domestic', 'Other'], 
        default: 'Personal Care' 
    },
    dosage: String,
    description: String,
});

module.exports = mongoose.model("Task", TaskSchema);