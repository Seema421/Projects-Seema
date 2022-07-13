//-------------------------------------------Imports-----------------------------------------------//
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const { isValidtitle, isValid, isValidName, isValidPhone, isValidEmail, isValidPassword } = require("../validator/validator")



//------------------------------------------Register User-----------------------------------------//

const createUser = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: "Provide details to create data" })
        let { name, email, phone, password, title, address } = data//destructruing the data
//------------------------------------------Mendatory Fields----------------------------------------------//

        if (!title) return res.status(400).send({ status: false, msg: "title is required" });
        if (!name) return res.status(400).send({ status: false, msg: "name is required" });
        if (!phone) return res.status(400).send({ status: false, msg: "phone is required" });
        if (!email) return res.status(400).send({ status: false, msg: "email is required" });
        if (!password) return res.status(400).send({ status: false, msg: "password is required" });
//-------------------------------------------Validations Check----------------------------------------------//

        if (isValidtitle(title)) return res.status(400).send({ status: false, message: `${title} must be Mr , Miss , Mrs` })
        //---(Name)
        if (!isValid(name)) return res.status(400).send({ status: false, msg: "name can not be empty" })
        if (!isValidName(name)) return res.status(400).send({ status: false, message: `${name} is Invalid` })
        //---(Phone)
        if (!isValidPhone(phone)) return res.status(400).send({ status: false, message: `${phone} Is Invalid` })
        //---(Email)
        if (!isValidEmail(email)) return res.status(400).send({ status: false, message: ` ${email} is invalid` });
        //---(Password)
        if (!isValidPassword(password)) {
            return res.status(400).send({ status: false, message: `password shoud be 8 to 15 characters which contain at least one numeric digit, one uppercase and one lowercase letter` })
        }
        // //-----------------------(Address)-------------------//
        // if (!isValid(address)) return res.status(400).send({ status: false, msg: "address can not be empty" })
        // if (address) {
        //     if (address.pincode) {
        //         if (!(/^(\+\d{1,3}[- ]?)?\d{6}$/.test(address.pincode))) return res.status(400).send({ status: false, message: "please provide valid pincode" })
        //     }
        // }
        //----------[Unique Fields]-----------------------//
        let Email = await userModel.findOne({ email })
        if (Email) return res.status(400).send({ status: false, message: "Email is already in use" })

        let Phone = await userModel.findOne({ phone })
        if (Phone) return res.status(400).send({ status: false, message: "Phone is already in use" })

        const savedData = await userModel.create(data)
        return res.status(201).send({ status: true, data: savedData })

    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
};
//---------------------------------------------------login-token creation-------------------------------------------//

const login = async (req, res) => {
    try {
        let data = req.body
        if (Object.keys(data) === 0) return res.status(400).send({ status: false, msg: "email and password required" })
        let { email, password } = data
        let user = await userModel.findOne({ email: email, password: password })
        if (!user) return res.status(400).send({ status: false, msg: "User is not registered" });
        let token = jwt.sign({
            Userid: user._id.toString(),
            //exp: Math.floor(Date.now() / 1000) + (10 * 60),
            iat: new Date().getTime()
        },
            "Project-3",
           );
        return res.status(200).send({ status: true, message: 'success', data: token })


    } catch (err) {
        return res.status(500).send({ sattus: false, msg: err.message })
    }
}

//---------------------------------Exports-----------------------------------------//
module.exports = {
    createUser, login
}