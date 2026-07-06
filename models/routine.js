const mongoose = require("mongoose");

const RoutineSchema = new mongoose.Schema({
    routineName: String,
    description: String,
    clientId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true 
    },
    tasks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task' 
    }],
});

module.exports = mongoose.model("Routine", RoutineSchema);