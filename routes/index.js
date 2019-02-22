var express = require('express');
var router = express.Router();
var Book = require("../models").Book;
const bodyParser = require('body-parser');

router.use(bodyParser.urlencoded({extended: false}));
/* GET home page. */
router.get('/', function(req, res, next) {
    res.redirect('/books/Page/1');
});

router.get('/books/all', function(req, res, next) {
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
//gets book details by id and renders update-book
router.get('/books/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book){
    if(book){
      res.render('update-book', { title: 'Update Book', book : book });
    }else {
      res.render("page-not-found")
      res.sendStatus(404)
    }
  }).catch(function(err){
    res.sendStatus(500)
  })
});
router.post('/books/:id', function(req, res, next) {
  Book.findById(req.params.id).then(function(book){
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


router.get('/books/Page/:number', function(req, res, next) {
  let offset = 0;
  let limit = 4
  if(req.params.number === 1){
    offset = 0
  }else if(req.params.number > 1){
    offset = (4 * (req.params.number - 1))
  }
  Book.findAll({order:[["title","ASC"]],}).then(function(books){
    if(req.params.number <= Math.ceil(books.length/limit)){
      res.render('index', { title: 'Books', books : books , limit:limit , offset: offset });
    }
    else{
      res.render('page-not-found')
      res.send(404)
    }
  }).catch(function(err){
    res.sendStatus(500)
  })
});

router.use((req, res, next) =>
{
    const err = new Error('Not Found');
    err.status = 404;
    console.log(err.message);
    console.log(err.status);
    console.log(err.stack);
    next(err)
})
//creats an error code for serverside issues such as missing data 
router.use((req,res,next) =>
{
  const err = new Error('Error with the server');
  err.status = 500;
  console.log(err.message);
  console.log(err.status);
  console.log(err.stack);
  next(err);
});
//renders the errors from error.pug temp
router.use((err, req, res, next) => 
{
    res.locals.error = err;
    res.status(err.status);
    if (err.status = 404){
    res.render("page-not-found")
    }else{
    res.render('error')
    }
})

module.exports = router;
