const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');

const setting = require('./../settings.json');

const app = express();

const login = require('./routes/login');
const send = require('./routes/send');
const checkCode = require('./routes/checkCode');
const sendNotice = require('./routes/sendNotice');
const sendCode = require('./routes/sendCode');
const result = require('./routes/result');

const sendNoticeAPI = require('./routes/api/sendNoticeAPI');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', login);
app.use('/login', login);
app.use('/send', send);
app.use('/sendCode', sendCode);
app.use('/checkCode', checkCode);
app.use('/sendNotice', sendNotice);
app.use('/result', result);

app.use('/api/sendmsg', sendNoticeAPI);

app.use(function(req, res, next) {
  next(createError(404));
});

app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  res.status(err.status || 500);
});

module.exports = app;
