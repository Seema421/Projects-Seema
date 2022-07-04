const mongoose = require('mongoose');
const express = require('express');//to handle our middleware set up and http request
const router = express.Router();

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true,
        unique:true,
        lowercase:true//Uppercase will convert itself into lowercase while creating college
    },
    fullName: {
        type: String,
        required: true,
        trim: true,
        unique:true
    },
    logoLink: {
        type: String,
        required: true,
        unique: true
    },
    isDeleted:
    {
        type: Boolean,
        default: false
    },
   
    

}, { timestamps: true });



module.exports = mongoose.model('College', collegeSchema)