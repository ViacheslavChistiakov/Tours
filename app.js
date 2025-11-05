const express = require('express');

const app = express();
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorHandler = require('./controllers/errorsController');
const routerTours = require('./routes/toursRoute');
const routerUsers = require('./routes/usersRoute');

// Middleware to parse JSON bodies
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}
app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

app.use('/api/v1/tours', routerTours);
app.use('/api/v1/users', routerUsers);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't reach out to this route: ${req.originalUrl}`, 404));
});

app.use(globalErrorHandler);

module.exports = app;
