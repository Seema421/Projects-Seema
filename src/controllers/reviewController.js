//-------------------------------------------Imports------------------------------------//
const { default: mongoose } = require("mongoose");
const bookModel = require("../models/bookModel");
const reviewModel = require("../models/reviewModel");
const { isValidRating, isValidName } = require("../validator/validator")
const jwt = require ("jsonwebtoken");
const { findOneAndUpdate } = require("../models/bookModel");


//--------------------------------------Post Review----------------------------------//
// const bookReview = async (req, res) => {
//     try {
//         let data = req.body
//         let { bookId, rating } = data

//        if (!Object.keys(data).length) return res.status(400).send({ status: false, msg: "Data required" })
//         let reviewedAt = new Date(Date.now()).toLocaleString()
//         console.log(new Date(Date.now()).toLocaleString())
//         data["reviewedAt"] = reviewedAt

//         //-----------------------------------Validations-------------------------------------//
//         if (!mongoose.Types.ObjectId.isValid(bookId)) return res.status(400).send({ status: false, message: "Invalid Id" })
//         if (!isValidRating(rating)) return res.status(404).send({ status: false, msg: `${rating} is not valid` })
//         let book = await bookModel.findById(bookId)
//         if(!book) return res.status(401).send({status:false, msg: "Book does not"})
//         let savedData = await reviewModel.create(data);
//         return res.status(201).send({ status: true, msg: savedData })

//     } catch (err) {
//         return res.status(500).send({ msg: err.message })
//     }
// };

// //--------------------------------------------POST /books/:bookId/review----------------------------------------//

const postreview = async (req,res) => {
    try{
        let data = req.body
        if(!Object.keys(data).length) return res.status(400).send({status:false,msg:"Review can not be empty"})
        let id = req.params.bookId
        let { review, rating, reviewedBy } =data
    //-----------------------------Basic Validation-------------------------------------//

        if(!review) return res.status(400).send({status:false,msg:"Review required"})
        if(!rating) return res.status(400).send({status:false,msg:"rating required"})
      
       
        if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).send({ status: false, message: "Invalid Id" })
        let book = await bookModel.findById(id)
        
        if(!book) return res.status(404).send({status:false,msg:"Book does not exist"})
        if(book.isDeleted===true ) return res.status(404).send({status:false,msg:"Data flagged deleted"})
        if (!isValidRating(rating)) return res.status(404).send({ status: false, msg: `${rating} is not valid` })

// //---------------------------------------------------Authentication-------------------------------------------------//
        let token = req.headers["x-api-key"]
        if(!token) token =req.headers['X-Api-Key'];
        if(!token) return res.status(401).send({status:false,msg:"Login Required"});

    //--------------------------------------postReview------------------------------------------------//   
        
        
        let reviewedAt = new Date(Date.now()).toLocaleString()
        data["reviewedAt"] = reviewedAt;
        data["bookId"] =id

        let reviewBook = await reviewModel.create(data)
        let reviewBookDataresponse = await reviewModel.findById(reviewBook._id).select({ __v: 0, updatedAt: 0, createdAt: 0, isDeleted: 0 })
        let bookData={book,reviewsData:reviewBookDataresponse}
        book.reviews = book.reviews+1;//updating the review count and saving
        book.save();
        
        
        return res.status(201).send({status:true,  message: 'success', data: bookData,})

    } catch (err){
        return res.status(500).send({status:false, msg:err.message})
    }
};

//-----------------------------------------------------PUT /books/:bookId/review/:reviewId--------------------------------------//

const updateReivew = async (req,res) => {
    try{
        let data = req.body
        let { review, rating, reviewedBy } = data
    //---------------------------------------------Basic Validation--------------------------------------------//

        if(!Object.keys(data).length) return res.status(404).send({status:false,msg:"Need data to update the document"})

        if (!isValidRating(rating)) return res.status(404).send({ status: false, msg: `${rating} is not valid` });
        if(!isValidName (reviewedBy)) return res.status(400).send({status:false, msg:"Invalid Name"})

        let bookid=req.params.bookId
        if(!bookid) return res.status(400).send({status:false, msg:"BookId required to update"})
        if(!mongoose.Types.ObjectId.isValid(bookid)) return res.status(400).send({status:false, msg:"Invalid Book Id"})
        let reviewid = req.params.reviewId
        if(!reviewid) return res.status(400).send({status:false, msg:"Review Id is required to update"})
        if(!mongoose.Types.ObjectId.isValid(reviewid)) return res.status(400).send({status:false,msg:"invalid Review Id"})
    //---------------------------------------------Id Check in db-----------------------------------------------------//
        let idBook=await bookModel.findOne({_id: bookid, isDeleted : false})
        if(!idBook) return res.status(404).send({status:false,msg:"Book not found"});

        let idReview=await reviewModel.findOne({_id:reviewid, isDeleted : false})
        if(!idReview) return res.status(404).send({status:false,msg:"Review not found"});

    //------------------------------------------------jwt------------------------------------------------//
        let token = req.headers["x-api-key"]
        if(!token) token =req.headers['X-Api-Key'];
        if(!token) return res.status(401).send({status:false,msg:"Login Required"});
        
       
        let reviewBook = await reviewModel.findOneAndUpdate(
            {_id:idReview},
            {$set: data},
            {new:true}
        )
        return res.status(200).send({status:true,message: "Book List",data :idBook, reviewsData:[{review:reviewBook.review,rating:reviewBook.rating,reviewerName:reviewBook.reviewedBy}]})
        } catch (err){
        return res.status(500).send({msg:err.message})
    }};

//--------------------------------------------------DELETE /books/:bookId/review/:reviewId-----------------------------//

    const deleteBookReview = async (req,res) => {
       
        let idBook= req.params.bookId
        let idReview =req.params.reviewId

//-----------------------------------id Validation&data check in database--------------------------------------------//

        if(!mongoose.Types.ObjectId.isValid(idBook)) return res.status(400).send({status:false,msg:"Bookid is not valid"})
        if(!mongoose.Types.ObjectId.isValid(idReview)) return res.status(400).send({status:false,msg:"ReviewId is not valid"})

        let review = await reviewModel.findById (idReview)
        if(!review) return res.status(404).send({status:false,msg:"Review does not exist"})
        
        let book = await bookModel.findById (idBook)
        if(!book) return res.status(404).send({status:false,message:"Book not found"})

        if(review.isDeleted===true ) return res.status(404).send({status:false,msg:"Review flagged deleted"})
    //------------------------------------------------jwt------------------------------------------------//
        let token = req.headers["x-api-key"]
        if(!token) token =req.headers['X-Api-Key'];
        if(!token) return res.status(401).send({status:false,msg:"Login Required"});
       
        book.reviews=book.reviews-1
        book.save()
        
        let deleteReview = await reviewModel.findOneAndUpdate(
            {_id: review._id},
            {$set:{isDeleted:true}},
            {new:true}
        )
        return res.status(200).send({status:true,message:"Successfully Deleted"})


    }


//----------------------------------------------------Exports---------------------------------------------//
module.exports = {
    postreview,updateReivew,deleteBookReview
};