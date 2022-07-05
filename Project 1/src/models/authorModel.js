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
    email: {
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

}, { timestamps: true }, );

module.exports = mongoose.model('AuthorProject', authorSchema)