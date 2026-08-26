const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other'],
    },
    dateOfBirth: {
        type: Date,
    },
    aboutMe: {
        type: String,
    },
    contactNumber: {
        type: Number,
    },
});

module.exports = mongoose.model('Profile', profileSchema);