const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const authorSchema = new mongoose.Schema({
    fname: {
        type: String,
        required: true,
    },
    lname: {
        type: String,
        required: true
    },
    emailId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true,
        enum: ["Mr.", "Mrs.", "Miss"]
    },
    password: {
        type: String,
        required: true
    },

}, { timestamps: true }, { strict: false });

module.exports = mongoose.model('AuthorProject', authorSchema)