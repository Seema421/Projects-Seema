//--------------Imports--------------------//
const mongoose = require ("mongoose");

//----------------CreatingModel
const urlSchema = new mongoose.Schema({
    urlCode: {
        type:String,
        required: true,
        unique: true,
        lowercase:true,
        trim:true
    },
    longUrl: {
        type: String,
        required: true,
        trim:true
    },
    shortUrl:{
        type:String,
        required:true,
        unique:true
    }

    
},{timestamps:true})

//---------------------Export
module.exports = mongoose.model('URL',urlSchema )