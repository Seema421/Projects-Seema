const collegeModel = require("../model/collegeModel")
const { isValid, isValidUrl, isValidCollegeName } = require("../Validator/validator")

//POST /functionup/colleges
const createCollege = async function (req, res) {
    try {
        res.setHeader('Access-Control-Allow-Origin','*')
        let data = req.body;
       
        if (!('name' in data) || !('fullName' in data) || !("logoLink" in data))
            return res.status(400).send({ status: false, msg: "name,fullName and logoLink can not be empty" })
            const { name, fullName, logoLink } = data
            if (!isValid(name)) return res.status(400).send({ status: false, msg: "name is required" })
        if (!isValidCollegeName(name)) return res.status(400).send({ status: false, msg: "collegeName is not valid" });
        if (!isValid(fullName)) return res.status(400).send({ status: false, msg: "fullName is required" })
        //fullName validation
        if (!(/^[A-Za-z_ ]+$/.test(fullName)))
            return res.status(400).send({ status: false, message: "College Full Name is Invalid " })
        if (!isValid(logoLink)) return res.status(400).send({ status: false, msg: "url can not be empty" });

        if (!isValidUrl(logoLink)) return res.status(400).send({ status: false, msg: "not a valid url" })
        if (await collegeModel.findOne({ logoLink: logoLink }))
            return res.status(400).send({ msg: "Duplicate Logo" })
     

        if (await collegeModel.findOne({ name:name }))
            return res.status(400).send({ msg: "This College Short Name is already exist" })
        if (await collegeModel.findOne({ fullName: fullName }))
            return res.status(400).send({ msg: "This College Full is already exist" })

        let savedData = await collegeModel.create(data);

        return res.status(201).send({ status: true, msg: savedData });
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}
module.exports = {
    createCollege
}//all module are private and making it public to use it anywhere in our app