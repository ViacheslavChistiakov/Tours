const express = require('express');

const app = express();
const morgan = require('morgan');
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

module.exports = app;
