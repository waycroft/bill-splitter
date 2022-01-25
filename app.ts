require('dotenv').config()
import createError from 'http-errors';
import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import mongoose from 'mongoose';

var indexRouter = require('./routes/index');
var transactionRouter = require('./routes/transaction');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/transaction', transactionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

const uri = `mongodb+srv://primary:${process.env.MONGO_CLOUD_PASSWORD}@cluster0.5flqb.mongodb.net/main?retryWrites=true&w=majority`;
mongoose.connect(uri);
mongoose.connection.on('connected',()=>{
  console.log('connected to mongodb');
});

mongoose.connection.on('error',(err)=>{
  console.log('error connecting to mongodb ', err);
});

module.exports = app;
