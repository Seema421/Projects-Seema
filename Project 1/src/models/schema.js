const mongoose = require('mongoose');
const Joi = require('@hapi/joi');

const schema = Joi.object({
    fname: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
    lname:Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required(),
    emailId: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    title: Joi.string().valid(...["Mr.", "Mrs.", "Miss"]),
    password:Joi.string().pattern(new RegExp('^[a-zA-Z0-9]{3,30}$')),

}, { timestamps: true }, { strict: false });

module.exports ={
    schema
}
