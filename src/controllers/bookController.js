//------------------------------Imports----------------------------------------//
const mongoose = require('mongoose')
const bookModel = require("../models/bookModel");
const userModel = require("../models/userModel");
const jwt = require("jsonwebtoken");
const reviewModel = require('../models/reviewModel');
const { isValid } = require("../validator/validator")




//----------------------------------------------createBooks----------------------------------------------//
const books = async (req, res) => {
    try {
        let data = req.body
        if (!Object.keys(data).length) return res.status(404).send({ status: false, msg: "Data required to create Books" });
        let { title, excerpt, userId, category, subcategory } = data

        //-----------------------------------------------Validations---------------------------------------------------//
        if (!mongoose.Types.ObjectId.isValid(userId)) return res.status(400).send({ status: false, message: "Invalid UserId" })
        let user = await userModel.findById(userId);
        if (!user) return res.status(400).send({ status: false, msg: "User not found" });
        let checkTitle = await bookModel.findOne({ title })
        if (checkTitle) return res.status(400).send({ status: false, msg: "title should be unique" })
        //-----------------------------------------------------JWT Check--------------------------------------//

        const userLoggedIn = req.Userid
        let userTryingToAccess = userId
        if (userTryingToAccess !== userLoggedIn) return res.status(403).send({ status: false, msg: "User is not allowed." })

        //----------------------------------------------Mendatory Fileds---------------------------------//

        if (!isValid(title)) return res.status(400).send({ status: false, msg: "Title is required" })
        if (!isValid(excerpt)) return res.status(400).send({ status: false, msg: "excerpt is required" })
        //if(!ISBN) return res.status(400).send({status:false, msg:`${ISBN} is required`})
        if (!isValid(category)) return res.status(400).send({ status: false, msg: "category is required" })
        if (!isValid(subcategory)) return res.status(400).send({ status: false, msg: "subcategory is required" })
        //--------------------------------------------------after validation check------------------------------//
        // const date = new Date()
        // console.log(date.toLocaleDateString(`fr-CA`).split('/').join('-'))
        let date = new Date()
        let day = date.getDate();
        let month = date.getMonth() + 1;
        let year = date.getFullYear();

        let fullDate = `${year}-${month}-${day}`;
        let releasedAt = fullDate
        data["releasedAt"] = releasedAt;
        let iSBN = Math.floor((Math.random() * 100000000000) + 1);
        data["ISBN"] = iSBN;
        let savedData = await bookModel.create(data)
        return res.status(201).send({ status: true, message: 'success', data: savedData })
    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
};

//------------------------------------------------------GetBooks queryPrams--------------------------------------------------------//

const getBooks = async (req, res) => {
    try {
        let query = req.query

        if (Object.keys(query).length == 0) return res.status(400).send({ status: false, msg: "Please provide data to search" });

        // let qwery = {isDeleted:false,...query}
        let books = await bookModel.findOne(query)
        if (!books) return res.status(404).send({ status: false, msg: "Data not present in database" })
        //console.log(books)//getting all books related to qwery

        // //------------------------------------------------------------JWT check--------------------------------------------------------------------//
        //         let token = req.headers["x-api-key"];
        //         if (!token) token = req.headers["X-Api-Key"]
        //         if (!token) return res.status(401).send({status:false,msg:"User is not logedIn"});
        //         let decodedToken = jwt.verify(token, "Project-3");
        //         if (!decodedToken) return res.status(403).send({ status: false, msg: "Access denied" });
        //         //let userTryingToAccess = userId//not required
        //         //console.log(userTryingToAccess)
        //         let userAuthorised = decodedToken.Userid
        //         let userTrying = books.find(x=>x.userId==userAuthorised)//getting object of user and that user which is authorised else undefined
        //         if(userTrying === undefined) return res.status(403).send({status:false,msg:"User is not authorised to access the data"})
        //         let idOfUser=userTrying.userId.toString()//here we are getting object id which we have to compare

        //        // if (userTryingToAccess!==userAuthorised) return res.status(403).send({ status: false, msg: "User is not allowed." })
        //         if (idOfUser !== userAuthorised) return res.status(403).send({ status: false, msg: "User is not allowed." })
        //     //-----------------------------------------------------getting------------------------------------------------//
        //         // let userTrying = books.find(x=>x.userId)            
        //         // let idOfUser=userTrying.userId.toString()
        //         let getBooks = await bookModel.find({userId:idOfUser,isDeleted:false},{_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1}).sort({title:1})

        let getBooks = await bookModel.find(query, { isDeleted: false }, { _id: 1, title: 1, excerpt: 1, userId: 1, category: 1, releasedAt: 1, reviews: 1 }).sort({ title: 1 })
        if (getBooks == null) return res.status(400).send({ status: false, msg: "already Deleated" })
        //return res.status(200).send({status:true, message: 'Books List', data: [{_id:userTrying._id, title:userTrying.title, excerpt:userTrying.excerpt,userId:userTrying.userId,category:userTrying.category,reviews:userTrying.reviews,releasedAt:userTrying.releasedAt}]})
        return res.status(200).send({ status: true, message: 'Books List', data: getBooks })

    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
};
//---------------------------------------------------------------GET /books/:bookId with reviews---------------------------------------------//

const getBooksById = async (req, res) => {
    try {
        let data = req.params.bookId

        if (!mongoose.Types.ObjectId.isValid(data)) return res.status(400).send({ status: false, msg: "Invalid Id" })
        let bookid = await bookModel.findById(data).select({ iSBN: 0, __v: 0 })
        if (!bookid) return res.status(404).send({ status: false, msg: "Nook Not found" })


        let review = await reviewModel.find({ bookId: data }, { isDeleted: 0, createdAt: 0, updatedAt: 0, __v: 0 })
        if (!review) return res.status(200).send({ status: true, message: "Book List", reviewData: [] })
        return res.status(200).send({ status: true, message: "Book List", data: bookid, reviewData: review });

    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
};
//-------------------------------------------------------put-update /books/:bookId-----------------------------------------------//

const updateBook = async (req, res) => {
    try {
        let data = req.params.bookId

        let upd = req.body
        let { title, ISBN, excerpt } = upd
        if (!mongoose.Types.ObjectId.isValid(data)) return res.status(400).send({ status: false, msg: "Invalid BookId" })
        if (!(title )) return res.status(400).send({ status: false, msg: "Please provide title!" });
        if (!(ISBN)) return res.status(400).send({ status: false, msg: "Please provide unique ISBN" });
        if (!(excerpt)) return res.status(400).send({ status: false, msg: "Please provide EXCERPT" });

        //-----------------------------------------------------JWT-----------------------------------------------------//

        const userAuthorised = req.Userid

        let bookToUpdate = await bookModel.findById(data)

        if (!bookToUpdate) return res.status(400).send({ status: false, msg: "Book is not present in out data base" })
        let userLoggedIn = bookToUpdate.userId.toString()
        if (userAuthorised !== userLoggedIn) return res.status(403).send({ status: false, msg: "User not allowed to update" })

        //-----------------------------------------Unique Field---------------------------------------//

        let titl = await bookModel.findOne({ title: title })
        if (titl) return res.status(400).send({ status: false, msg: "Title should be unique" })
        let iSBN = await bookModel.findOne({ ISBN: ISBN })
        if (iSBN) return res.status(400).send({ status: false, msg: "ISBN should be unique" })

        //-----------------------------------------------------Update---------------------------------------------------//

        let update = req.body
        //update.releasedAt = new Date(Date.now()).toLocaleString();//not required
        let updateData = await bookModel.findOneAndUpdate(
            { $and: [{ _id: data }, { isDeleted: false }] },
            { $set: update },
            { new: true }
        )
        if (updateData == null) return res.status(400).send({ status: false, msg: "Already deleted" })
        return res.status(200).send({ status: true, message: "Success", data: updateData })

    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
};
//--------------------------------------------DELETE /books/:bookId---------------------------------------------------//

const deleteBook = async (req, res) => {
    try {
        let id = req.params.bookId
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ status: false, msg: "Invalid ObjectId" })
        let book = await bookModel.findById(id)
        if (!book) return res.status(404).send({ status: false, msg: "Book is not present in database" })
        //-----------------------------------------------------JWT-----------------------------------------------------//
        
        let userAuthorised = req.Userid//getting token detail from the request body which we alreadt set in auth in response line 18
        let userLoggedIn = book.userId.toString();
        if (userAuthorised !== userLoggedIn) return res.status(403).send({ status: false, msg: "User not allowed to delete" })
        //-----------------------------------------------------Delete---------------------------------------------------//

        const bookToDelete = await bookModel.findOneAndUpdate(
            { $and: [{ _id: id }, { isDeleted: false }] },
            { $set: { isDeleted: true } },
            { new: true })

        if (bookToDelete == null) return res.status(400).send({ status: false, msg: "Already Deleated" })
        return res.status(200).send({ status: true, message: "Book Deleted successfully" })
    } catch (err) {
        return res.status(500).send({ msg: err.message })
    }
};

//-------------------------------------Exports----------------------------------//
module.exports = {
    books, getBooks, getBooksById, updateBook, deleteBook
}