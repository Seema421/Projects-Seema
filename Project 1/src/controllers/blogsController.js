const blogsModel = require("../models/blogsModel")
const authorModel = require("../models/authorModel")
const { findOneAndUpdate } = require("../models/blogsModel")
const { query } = require("express")
const { payload } = require("@hapi/hapi/lib/validation")
const jwt = require("jsonwebtoken")


//create a blog with authorId/routename blogs//validation in route through middleware
const createBlogs = async function (req, res) {
    let detail = req.body
    let data = Object.keys(detail)
    if (!data) return res.status(400).send({ status: false, msg: "Invalid Argument" })
    let savedData = await blogsModel.create(detail)
    res.status(201).send({ status: true, msg: savedData })
}
//return all blogs that are deleted and not published and then applying other condition as well in query params
const returnBlogs = async function (req, res) {
    let query = req.query
    // let data = Object.keys(query);
    // if(!data.length) return res.status(404).send({msg:"Invalid Request"})
    let blog = await blogsModel.find({ $and: [(query), { isPublished: true }, { isDeleted: false },] })
    if (blog == false) return res.status(404).send({ status: false, msg: " " })
    console.log(query)
    res.status(200).send({ status: true, msg: blog })
}

//PUT /blogs/:blogId
const updateBlogs = async function (req, res) {
    try {
        let update = req.body;
        console.log(req.token)
        //update.authorId = req.token.authorId//verifies author is setting up set after checking body is empty or not
        let data = Object.keys(update)
        if (!data.length) return res.status(404).send({ status: false, msg: "Data can not be empty" })

        //update.isPublishedAt = new Date(); to modify it should be any array we can update it not modify
        //console.log(update)
        let bid = req.params.blogId
        //console.log(bid)
        let blogid = await blogsModel.findById(req.params.blogId)
        //console.log(blogid)
        let authorIdTryingtoUpdate = blogid.authorId.toString();//id which is cmg is in object form have to convert it into string
        //console.log(authorIdTryingtoUpdate)
        let token = req.headers["x-api-key"]
            let decodedToken = jwt.verify(token, 'Project-1');
        if (!decodedToken) return res.status(403).send({ status: false, msg: "User is not Authorised to make changes" });
        let verifiedAuthor = decodedToken.userid
        // console.log(verifiedAuthor)
        if (authorIdTryingtoUpdate !== verifiedAuthor) return res.status(403).send({ status: false, msg: "This request can not be processed" });
        let updatedblog = await blogsModel.findOneAndUpdate(
            { $and: [{ isDeleted: false }, { _id: req.params.blogId }, {}] },
            { $push: update },
            { new: true })
        //console.log(updatedblog)
        return res.status(200).send({ status: true, data: updatedblog })
    } catch (err) {
        res.status(500).send({ msg: err.message })
    }
}
//DELETE /blogs/:blogId
const deletedBlog = async function (req, res) {
    try {
        let blogid = req.params.blogId
        let blog = await blogsModel.findById(blogid)
        if (!blog) return res.status(400).send({ status: false, msg: "No such blog exist" })
        let authorTryingToUpdate = blog.authorId.toString();//because authorId will get in object to convert in into string use .toString()
        let token = req.headers["x-api-key"];
        if (!token) token = req.headers["X-Api-Key"]
        if (!token) return res.status(401).send({ status: false, msg: "User must login ist" });
        let decodedToken = jwt.verify(token, "Project-1")
        if (!decodedToken) return res.status(403).send({ status: false, msg: "Client does not have access" })
        let authorLoggedin = decodedToken.userid;
        if (authorTryingToUpdate !== authorLoggedin) return res.status(405).send({ status: false, msg: "User is not allowed to access this data" })
        let deletedBlog = await blogsModel.findOneAndUpdate(
            { $and: [{ isDeleted: false }, { _id: blog }] },
            { $set: { isDeleted: true,isDeletedAt:new Date() } },
            { new: true }
        )
        return res.status(200).send({ status: true, msg: deletedBlog })
    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}
//DELETE /blogs?queryParams
const deletedBlogbyQuery = async function (req, res) {
    try {
        let query = req.query
        //console.log(query)
        let data = Object.keys(query)
        if (!data.length) return res.status(411).send({ status: false, msg: "Data can not be empty" });
        let blog = await blogsModel.find(query).select({ authorId: 1, _id: 1 })//
        console.log(blog)
        let token = req.headers["x-api-key"]
        if (!token) return res.status(401).send({ status: false, msg: "Author is not authenticated" })
        let decodedToken = jwt.verify(token, "Project-1")
        console.log(decodedToken)
        if (!decodedToken) return res.status(403).send({ status: false, msg: "User is not authorised" })
        let authorisedId = decodedToken.userid
        console.log(authorisedId)
        let auth = blog.find(e => e.authorId == authorisedId)//here we are finding out author id which is related to query params and whose value is equal to our decodedToken. if we will find the value we will get authorid else undefined
        console.log(auth)
        if (auth === undefined) return res.status(404).send({ msg: "no such blog found to delete in your collection" })
        // console.log(req.token)//it will give us author id which is in decoded token and it will give us those author id only which is authorised to update or delete    
    //   let deletBlog=await blogsModel.updateMany(
    //     {...query,authorId:authorisedId,isDeleted:false},
    //     {isDeleted:true,deletedAt:new Date()},
    //     {new:true}
    //   )
      //above 105-108 is also correct and below is also correct (i discovered myself)can use .filter also at101 because .find will give us ist condition that satisfy
        let deletBlog = await blogsModel.findByIdAndUpdate(
            { _id: auth._id },
            { $set: { isDeleted: true, isDeletedAt: new Date() } },
            { new: true })
        console.log(deletBlog)
        return res.status(200).send({ status: true, msg: deletBlog })
    }
    catch (err) {
        return res.status(500).send({ msg: err.message })
    }
}


module.exports.createBlogs = createBlogs
module.exports.returnBlogs = returnBlogs
module.exports.updateBlogs = updateBlogs
module.exports.deletedBlog = deletedBlog
module.exports.deletedBlogbyQuery = deletedBlogbyQuery
