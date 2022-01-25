"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const mongoose_1 = __importDefault(require("mongoose"));
var indexRouter = require('./routes/index');
var transactionRouter = require('./routes/transaction');
var app = (0, express_1.default)();
app.set('views', path_1.default.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use((0, morgan_1.default)('dev'));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/transaction', transactionRouter);
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
app.use(function (err, req, res, next) {
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};
    res.status(err.status || 500);
    res.render('error');
});
const uri = `mongodb+srv://primary:${process.env.MONGO_CLOUD_PASSWORD}@cluster0.5flqb.mongodb.net/main?retryWrites=true&w=majority`;
mongoose_1.default.connect(uri);
mongoose_1.default.connection.on('connected', () => {
    console.log('connected to mongodb');
});
mongoose_1.default.connection.on('error', (err) => {
    console.log('error connecting to mongodb ', err);
});
module.exports = app;
//# sourceMappingURL=app.js.map