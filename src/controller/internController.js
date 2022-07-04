const { updateOne } = require("../model/collegeModel");
const collegeModel = require("../model/collegeModel");
const internModel = require("../model/internModel");

const { isValid, isValidEmail, isValidMobile, isValidCollegeName } = require("../validator/validator");

const createIntern = async function (req, res) {
    
    try {
        res.setHeader('Access-Control-Allow-Origin','*')
        let data = req.body
        let { name, email, mobile, collegeName } = req.body//extract params
        console.log(name, email, mobile, collegeName)
        if (!isValid(collegeName)) return res.status(400).send({ status: false, msg: "collegeName is required" })

        let college = await collegeModel.findOne({ name: collegeName })
        if (!college) return res.status(404).send({ status: false, msg: "college not found" })

        let mobileAndEmail = await internModel.findOne({ $and: [{ mobile: mobile, email: email }] })
        if (mobileAndEmail) return res.status(400).send({ status: false, msg: "Either mobile No. or email is already registered" })
        console.log(mobileAndEmail)
        if (!isValid(name)) return res.status(400).send({ status: false, msg: "name is required" })
        //name validation
        if (!(/^[A-Za-z_ ]+$/.test(name)))
            return res.status(400).send({ status: false, message: "Name is Invalid " })
        //if (!isValidName(name)) return res.status(400).send({ status: false, msg: "name is not valid" });

        if (!isValid(email)) return res.status(400).send({ status: false, msg: "email can not be empty" });
        if (!isValidEmail(email)) return res.status(400).send({ status: false, msg: "Invalid email" })

        if (!isValid(mobile)) return res.status(400).send({ status: false, msg: "mobile can not be empty" });
        if (!isValidMobile(mobile)) return res.status(400).send({ status: false, msg: "Invalid mobile" })
        const collegeNamePresent = await collegeModel.findOne({ name: collegeName, isDeleted: false })

        if (!collegeNamePresent) {
            return res.status(400).send({ status: false, message: `no college found by this name: ${collegeName}` })
        }

        const collegeID = collegeNamePresent._id
        data["collegeId"] = collegeID;//we set collegeId in req body so that we can find college with college id
        let savedData = await internModel.create(data)
        return res.status(201).send({ status: true, msg: savedData })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

//GET /functionup/collegeDetails via queryparams
const getCollege = async function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin','*')
        let { collegeName } = req.query
        let query = req.query
        let data = Object.keys(query)//object.keys only RETURN keys in array of strings and only keys
        if (!data.length) return res.status(400).send({ status: false, msg: "Data can not be empty" });
        if (!isValidCollegeName(collegeName)) return res.status(400).send({ status: false, msg: "collegeName is not valid" });
        //regex will check our query with all letter its matching or not and ignoring case sensitivity
        let collegeDetail = await collegeModel.findOne({ name: collegeName, isDeleted: false })
        console.log(collegeDetail)
        if (!collegeDetail) return res.status(400).send({ status: false, msg: "College is not exist" })
        const collegeID = collegeDetail._id
        let interns = await internModel.find({ collegeId: collegeID, isDeleted: false }, { name: 1, email: 1, mobile: 1 })
        //if we have to array then we can define length also intern.length
        if (!interns.length) return res.status(400).send({ data: { name: collegeDetail.name, fullName: collegeDetail.fullName, logoLink: collegeDetail.logoLink }, Interns: "No Interns associated with this college" })
        return res.status(200).send({ data: { name: collegeDetail.name, fullName: collegeDetail.fullName, logoLink: collegeDetail.logoLink, interns: interns } })
    } catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}



module.exports = { createIntern, getCollege }

