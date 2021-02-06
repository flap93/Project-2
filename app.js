require('dotenv').config();
const path = require('path'); 
const express = require('express');
const createError = require('http-errors');
const logger = require('morgan');
const favicon = require('serve-favicon');

const cookieParser = require('cookie-parser');
const hbs = require('hbs');
const mongoose = require('mongoose');
  // const scheduler = require('./configs/scheduler.config');
  // const checkAndSendNecessaryMessages = require('./configs/marcos.config');
const app = express();



//Message from Twilio
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
// const schedule = require('node-schedule-tz');

// Set up the database
require('./configs/db.config');
require('./configs/session.config')(app);
// require('./configs/api.config');
// require('./configs/messagesWorker');
// require('./configs/scheduler.config');
// require('./configs/marcos.config');


const bindUserToLocals = require("./configs/user-locals.config");
app.use(bindUserToLocals);

// Routers
const indexRouter = require('./routes/index.routes');
const authRouter = require('./routes/auth.routes');
const userInterRouter = require('./routes/userInter.routes');
const reminderRouter = require('./routes/reminder.routes');

// Express View engine setup

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'images', 'favicon.ico')));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

const app_name = require('./package.json').name;
const debug = require('debug')(`${app_name}:${path.basename(__filename).split('.')[0]}`);

// Routes middleware
app.use('/', indexRouter);
app.use('/', authRouter);
app.use('/', userInterRouter);
app.use('/', reminderRouter);

// Catch missing routes and forward to error handler
app.use((req, res, next) => next(createError(404)));

// Catch all error handler
app.use((error, req, res) => {
  // Set error information, with stack only available in development
  res.locals.message = error.message;
  res.locals.error = req.app.get('env') === 'development' ? error : {};

  // render the error page
  res.status(error.status || 500);
  res.render('error');

});
//scheduler.start();


module.exports = app;
