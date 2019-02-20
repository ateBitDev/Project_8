var express = require('express');
var mainRoute = require('./routes');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(__dirname + '/public'))
// view engine setup
app.set('view engine', 'pug');

app.use('/', mainRoute);

// catch 404 and forward to error handler
app.use((req, res, next) =>
{
    const err = new Error('Not Found');
    err.status = 404;
    console.log(err.message);
    console.log(err.status);
    console.log(err.stack);
    next(err)
})
//creats an error code for serverside issues such as missing data 
app.use((req,res,next) =>
{
  const err = new Error('Error with the server');
  err.status = 500;
  console.log(err.message);
  console.log(err.status);
  console.log(err.stack);
  next(err);
});
//renders the errors from error.pug temp
app.use((err, req, res, next) => 
{
    res.status(err.status);
    console.log(err.status)
    if(err.status === 404){
    res.render('page-not-found')
    }
    else{
    console.log(err.status)
    res.render('error', {error: err})
    }
})
// error handler

module.exports = app;
