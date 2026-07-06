const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");
const plugin = typeof passportLocalMongoose === 'function' ? passportLocalMongoose : passportLocalMongoose.default;

const UserSchema = new mongoose.Schema({
    nhsNumber: {
        type: String,
        unique: true, 
        sparse: true
    },
    username: String,
    userForename: String,
    userSurname: String,
    userDOB: Date,
    phoneNumber: String,
    userAddress: {
        street: String,
        town: String,
        county: String,
        postcode: String,
        country: String,
        coordinates: {
            latitude: Number,
            longitude: Number
        }
    },
    userStatus: { type: Boolean, default: true },
    userType: { 
        type: String, 
        enum: ['carer', 'client', 'admin'], 
        default: 'client' 
    },
    adminAC: { type: Boolean, default: false }
});

UserSchema.plugin(plugin);

module.exports = mongoose.model("User", UserSchema);