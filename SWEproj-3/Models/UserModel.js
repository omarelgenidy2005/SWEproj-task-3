const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: true},
    email: { type: String, required: true, unique: true},
    password: { type: String, required: true},
    profilePicture: { type: String},
    role: {
        type : String,
        enum: ['Standard User' , 'Organizer' , 'System Admin'],
        required: true
    },
}, {timestamp : true});

module.exports = mongoose.model('User' , UserSchema);