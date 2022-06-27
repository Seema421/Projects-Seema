const { result } = require("@hapi/joi/lib/base")
const jwt = require("jsonwebtoken")
const authorModel = require("../models/authorModel")
const blogsModel = require("../models/blogsModel")
const { schema } = require("../models/schema")



const schemaAuthor = async function (req, res) {
    try {
        let data = req.body
        const result = await schema.validateAsync(req.body)//using joi ist we will validate out req.body after validation it will move to next line.It will not save data for savoing data we used authormodel
        let savedData = await authorModel.create(data)
        console.log(savedData)
        res.send(savedData)
    }
    catch (error) {
        if (error.isJoi === true) error.status = 422
        return res.status(500).send({ msg: error.message })
    }
}

//signup done now Author will login//POST LOGIN 
const authorLogin = async function (req, res) {
    try{
        let userName = req.body.emailId
        let passWord = req.body.password
        let data = Object.keys(userName,passWord);
        if(!data.length) return res.status(400).send({status:false, msg:"Email Id and password is required to login"})
        let author = await authorModel.findOne({ emailId: userName, password: passWord })
        console.log(author)
        if (!author) return res.status(400).send({ status: false, msg: "Data not found" })
        let token = await jwt.sign({ userid: author._id.toString() }, "Project-1")
        res.status(201).send({status:true ,msg:token })
    }catch(err){
        return res.status(500).send({msg:err.message})
        }
}

const getUsersData = async function (req, res) {
    let allUsers = await UserModel.find()
    res.send({ msg: allUsers })
}
// //POST /login Token generation
// const login = async function (req, res) {
//     let userName = req.body.emailId
//     let passWord = req.body.password
//     let author = await authorModel.findOne({ emailId: userName, password: passWord })
//     if (!author) res.status(400).send({ msg: "Author is not exist" });
//     //if present create jwt token
//     let token = await jwt.sign({ userid: author._id.toString() }, "Project-1")
//     res.status(200).send({ status: true, msg: token })
// }
//authentication-update blog-find one and update
const createAblog = async function (req, res) {

    //     let token = req.headers ["x-api-key"];
    //     console.log(token)
    //    // if(!token) token =req.headers["X-Api-Key"];
    //     if(!token) return res.status(400).send({status:false,msg:"Author not loged In"});
    //     let decodedToken = jwt.verify(token,"Project-1");
    //     if(!decodedToken) return res.status(403).send({status:false,msg:"Not Authorised"});
    //     let author = req.params.authorId
    //     console.log(author)
    let update = req.body
    let blogId = await blogsModel.findById(req.params.authorId)
    console.log(blogId)
    let updatedBlog = await blogsModel.findOneAndUpdate(
        { _id: req.params.authorId },
        { $set: update },
        {
            new: true,
            upsert: true
        })
    console.log(update)
    res.status(200).send({ status: true, data: updatedBlog })
}
//get the list of blogs
const getList = async function (req, res) {
    // let token = req.headers["x-api-key"];
    // if(!token) return res.status(401).send({status:false,msg:"Author is not authorised"})
    // let decodedToken = jwt.verify(token, "Project-1");
    // if(!decodedToken) return res.status(403).send({status:false, msg:"Author is forbidden"});
    let author = req.params.authorId;
    console.log(author);
    // let authorSignedUp=decodedToken.userid;
    // console.log(authorSignedUp);
    // if(author!==authorSignedUp) return res.status(403).send({status:false,msg:"Validation Failed"});
    let listofblogs = await blogsModel.find({ _id: req.params.authorId })
    res.status(200).send({ status: false, msg: listofblogs })
}
//delete a blog find one and delete
const markDeleted = async function (req, res) {
    // let token = req.headers["x-api-key"] || req.headers["X-Api-Key"];
    // if (!token) return res.status(404).send({ status: false, msg: "Request in invalid" });
    // let decodedToken = jwt.verify(token, "Project-1", (err, payload) => {
    //     if (err) {
    //         return res.status(401).send({ status: false, msg: err.message });
    //     }
    // });
    // let author = req.params.authorId
    // let authorLoggedin = decodedToken.userid
    // if (author !== authorLoggedin) return res.status(403).send({ status: false, msg: "Not Allowed to access" });
    let deletedblog = await blogsModel.findOneAndUpdate(
        { _id: req.params.authorId },
        { $set: { isDeleted: true } },
        {
            new: true,
            upsert: true
        })
    return res.status(200).send({ status: true, msg: deletedblog })
}
//delete a bnlog by queryparams

module.exports.schemaAuthor = schemaAuthor
module.exports.authorLogin = authorLogin

module.exports.getUsersData = getUsersData
module.exports.createAblog = createAblog
module.exports.getList = getList
module.exports.markDeleted = markDeleted
module.exports.schemaAuthor = schemaAuthor


