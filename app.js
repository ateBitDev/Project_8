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

// error handler

module.exports = app;
