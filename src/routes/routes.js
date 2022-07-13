//-----------Imports---------------------------------//
const express = require("express");
const router = express.Router();
const userController = require ("../controllers/userController");
const bookController = require ("../controllers/bookController");
const reviewController = require ("../controllers/reviewController");
const middleware = require("../middleware/auth")


//---------------API's---------------//

router.post("/register",userController.createUser);//user register
router.post("/books",middleware.auth,bookController.books);// book creation
router.post("/login",userController.login);// login
router.get("/books",bookController.getBooks);// GET /books-return all books


router.get("/books/:bookId",bookController.getBooksById);//get books with review by params
router.put("/books/:bookId",middleware.auth,bookController.updateBook);//update books by params
router.delete("/books/:bookId",middleware.auth,bookController.deleteBook);//delete books by params

//router.post("/review",reviewController.bookReview);//review creation
router.post("/books/:bookId/review",reviewController.postreview);//post review deleated false and book exist
router.put("/books/:bookId/review/:reviewId",reviewController.updateReivew);//update reviews
router.delete("/books/:bookId/review/:reviewId",reviewController.deleteBookReview);//delete reviews



module.exports = router
