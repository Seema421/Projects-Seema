const mongoose = require('mongoose');


const reviewModel = new mongoose.Schema({
    "bookId": {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Books",
        //required: true
    },
    "reviewedBy": {
        type: String,
        required: true,
        default: 'Guest',
        trim : true
    },

    "reviewedAt": {
        type: String,
        //required: true
    },

    "rating": {
        type: "Number",
        required: true,
        trim:true
    },
    "review": {
        type: String,
        trim: true
    },
    "isDeleted": {
        type: Boolean,
        default: false
    },


}, { timestamps: true });

module.exports = mongoose.model('Review', reviewModel);