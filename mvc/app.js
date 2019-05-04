// const config = require('./config.json');
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');

var passport = require('./passport');

var hbs = require('hbs');
var fs = require('fs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

let header = fs.readFileSync(path.join(__dirname,"views","user","template","header.hbs"), 'utf-8');
let footer = fs.readFileSync(path.join(__dirname,"views","user","template","footer.hbs"), 'utf-8');

hbs.registerPartial('userHeader',  header);
hbs.registerPartial('userFooter',  footer);
hbs.registerHelper('getDate', function(date) { //bỏ múi giờ
  return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
});


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', userRouter);
app.use('/admin', adminRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  console.log(req.app.get('env'));
  
  // render the error page
  res.status(err.status || 500);
  res.render('error/error', {
    err: err
  });
});

module.exports = app;
