const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const compress = require('compression');
const bugsnag = require('bugsnag');
const indexRouter = require('./routes/index');

bugsnag.register(process.env.BUGSNAG_API);
const app = express();

// Para para que los errores Asincronos pasen al errorHandler
app.use(bugsnag.requestHandler);

if (process.env.NODE_ENV === 'development') {
  app.use(logger('dev'));
} else if (process.env.NODE_ENV === 'production') {
  app.use(compress());
}
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Rutas
app.use('/', indexRouter);

// Error handler
app.use(bugsnag.errorHandler);

module.exports = app;
