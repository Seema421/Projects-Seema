const mongoose = require('mongoose');

const blogsSchema = new mongoose.Schema( {
    title: {
        type: String,
        required: true,
        trim:true
    },
    body:{
        type: String,
        required: true,
        trim: true
    },
    authorId:{
        type : mongoose.Schema.Types.ObjectId,
        ref : "AuthorProject",
        required:"authorId is required"
    },
    tags:{
        type :[String],
        trim:true
    },
    category:{
        type :[String],
        required: true,
        trim:true
    },
    subcategory:{
        type :[String],
        trim:true
    },
    isDeleted: {
        type: Boolean, 
        default: false
    }, 
    isPublished: {
        type: Boolean, 
        default: false
    },
    isPublishedAt: {
        type:Date,
        default:null
    },
    isDeletedAt: {
        type:Date,
        default:null
    }
    
    
    
}, { timestamps: true },);

module.exports = mongoose.model('BlogsProject', blogsSchema)