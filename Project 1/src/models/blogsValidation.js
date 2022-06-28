const mongoose = require('mongoose');
const Joi = require('@hapi/joi');
Joi.objectId = require('joi-objectid')(Joi)

const blogsV = Joi.object({
    title: Joi.string()
    .required(),
    body:Joi.string()
    .required(),
    tags:Joi.array().items(Joi.string()),
    category:Joi.string(),
    subcategory:Joi.array().items(Joi.string()),
    isPublished:Joi.boolean(),
    authorId: Joi.objectId().required(),
    

}, { timestamps: true }, { strict: false });

module.exports ={
    blogsV
}