var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/books');
});

router.get('/books', function(req, res, next) {
  Book.findAll({order:[["title","ASC"]]}).then(function(books){
    res.render('index', { title: 'Books', books : books });
  }).catch(function(err){
    res.sendStatus(500)
  })
});

router.get('/books/new', function(req, res, next) {
  res.render('new-book', { title: 'New Book', book: Book.build()});
});

router.post('/books/new', function(req, res, next) {
  Book.create(req.body).then(function(){
    res.redirect("/");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      res.render("new-book",{
        book: Book.build(req.body),
        title: "New Book",
        errors: err
      });
    }else{
      throw err
    }
  }).catch(function(err){
    res.sendStatus(500)
  });
});

router.get('/books/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then(function(book){
    if(book){
      res.render('update-book', { title: 'Update Book', book : book });
    }else {
      res.sendStatus(404)
    }
  }).catch(function(err){
    res.sendStatus(500)
  })
});
router.post('/books/:id', function(req, res, next) {
  Book.findByPk(req.params.id).then(function(book){
    if(book){
      return book.update(req.body);
    }else{
      res.sendStatus(500)
    }
  }).then(function(){
    res.redirect("/");
  }).catch(function(err){
    if(err.name === "SequelizeValidationError"){
      var book = Book.build(req.body);
      book.id = req.params.id;
      res.render("update-book",{
        book: book,
        title: "Update Book",
        errors: err
      });
    }else{
      throw err
    }}).catch(function(err){
    res.sendStatus(500)
  })
});

router.post('/books/:id/delete', function(req, res, next) {
  Book.findByPk(req.params.id).then(function(book){
    if(book){
      return book.destroy();
    }else{
      res.sendStatus(404)
    }
  }).then(function(){
    res.redirect("/");
  }).catch(function(err){
    res.sendStatus(500)
  })
});

module.exports = router;
