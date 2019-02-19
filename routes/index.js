var express = require('express');
var router = express.Router();
var Book = require("../models").Book;

/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/books');
});

router.get('/books', function(req, res, next) {
  Book.findAll({order:[["title","ASC"]]}).then(function(books){
    console.log(books)
    res.render('index', { title: 'Books', books : books });
  })
});

router.get('/books/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book){
    console.log(book)
    res.render('update-book', { title: 'Books', book : book });
  })
});

module.exports = router;
