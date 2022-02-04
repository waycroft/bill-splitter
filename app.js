require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');
const debugMongo = require('debug')('mongoDB');
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
const indexRouter = require('./src/routes/index_route');
const transactionRouter = require('./src/routes/transaction_route');
const poolRouter = require('./src/routes/pool_route');
const userRouter = require('./src/routes/user_route');
app.use('/', indexRouter);
app.use('/transaction', transactionRouter);
app.use('/pool', poolRouter);
app.use('/user', userRouter);
app.use(function (req, res, next) {
    next(createError(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
const uri = `mongodb+srv://primary:${process.env.MONGO_CLOUD_PASSWORD}@cluster0.5flqb.mongodb.net/main?retryWrites=true&w=majority`;
mongoose.connect(uri);
mongoose.connection.on('connected', () => {
    debugMongo('connected to mongodb');
});
mongoose.connection.on('error', (err) => {
    debugMongo('error connecting to mongodb ', err);
});
module.exports = app;
//# sourceMappingURL=app.js.map