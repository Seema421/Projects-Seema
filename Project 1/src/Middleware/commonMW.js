const mongoose = require('mongoose');
const express = require('express');
const authorModel = require('../models/authorModel');
const checkid = mongoose.isValidObjectId;
const jwt = require("jsonwebtoken")
const Joi=require('joi');
const { payload } = require('@hapi/hapi/lib/validation');
const blogsModel = require('../models/blogsModel');

const validation = async function (req, res, next) {
    try {
        let author = req.body.authorId
        if(!author) author=req.params.blogId
        //console.log(author)
        if (!author) return res.status(403).send({ msg: "User is not authorised" })
        let authorPresent = await authorModel.findById(author)
        if (!authorPresent)authorPresent=await blogsModel.findById(author)
        if (!authorPresent) return res.status(404).send({ msg: "Data not found" })

        next()
    }

    catch (err) {
        console.log(err.message)
        res.status(500).send({ msg: err.message })
    }
}
//only for token generation
const authentication = async function (req, res, next) {
    try {
        let userName = req.body.emailId
        let passWord = req.body.password
        let author = await authorModel.findOne({ emailId: userName, password: passWord })
        if (!author) res.status(400).send({ msg: "Author is not exist" });
        //if present create jwt token
        let token = await jwt.sign({ userid: author._id.toString() }, "Project-1")
        res.status(200).send({ status: true, msg: token })
        next()
    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}

const authorisation = async function (req, res, next) {
    try {
        let token = req.headers["x-api-key"];
        //console.log(token)
        // if(!token) token =req.headers["X-Api-Key"];
        if (!token) return res.status(400).send({ status: false, msg: "Token Required" });
        let decodedToken = jwt.verify(token, "Project-1")   
        if (!decodedToken) return res.status(403).send({ status: false, msg: "Not Authorised" });
       // console.log(decodedToken)
       req.token=decodedToken//we are setting token which is having  user id in request body
        let author=req.body.authorId
        if(!author) author = req.params.blogId
        //console.log(author)
        let authorSignedUp = decodedToken.userid;
        //console.log(authorSignedUp);
        if (author!==authorSignedUp) return res.status(403).send({ status: false, msg: "Validation Failed" });
        next()
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports.validation = validation
module.exports.authentication = authentication
module.exports.authorisation = authorisation
