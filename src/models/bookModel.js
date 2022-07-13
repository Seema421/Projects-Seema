const { string } = require('joi');
const mongoose = require('mongoose')

const bookModel = new mongoose.Schema({

    title: {
        type: String,
        required: true,
        unique:true,
        trim:true
    },
    excerpt: {
        type: String,
        required: true,
        trim:true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        trim:true
    },
    ISBN: {
        type: String,
        required: true,
        unique: true,
        trim:true
    },
    category: {
        type: String,
        required: true,
        trim:true
    },
    subcategory: {
        type: [String],
        required: true,
        trim:true
    },
    reviews: {
        type : Number,
        default:0,
        comment: {type : String}
    },
    deletedAt : Date,
    isDeleted: {
        type : Boolean,
         default: false
    },
    releasedAt: {type : Date,
         required : true,
    },
    
  

}, { timestamps:true });

module.exports = mongoose.model('Books', bookModel);