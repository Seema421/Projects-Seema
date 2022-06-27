const express = require('express');
const router = express.Router();
const commonMW = require ("../middleware/commonMW")
const authorController= require("../controllers/authorController")
const blogsController = require("../controllers/blogsController")


//authors is exitra
router.post("/authors", authorController.schemaAuthor)//with schema.js validate and create using authormodel//author create
router.post("/login",authorController.authorLogin)//TOKEN GENERATION
router.post("/blogs",commonMW.validation,commonMW.authorisation,blogsController.createBlogs)//blogs create ist it will check author id is present or not then it will check do we have this author in our authorcntroller then it will check for token and validation of token
router.get("/blogs",blogsController.returnBlogs)//get request
router.put("/blogs/:blogId",commonMW.validation,blogsController.updateBlogs)
router.delete("/blogs/:blogId",blogsController.deletedBlog)
router.delete("/blogs",blogsController.deletedBlogbyQuery)

module.exports = router;