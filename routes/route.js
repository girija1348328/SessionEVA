const express = require('express');
const router = express.Router();
const bookController = require("../controllers/bookController")



//books
router.post("/books",bookController.createBook) 
//router.get("/books", bookController.getBooks)

module.exports = router;