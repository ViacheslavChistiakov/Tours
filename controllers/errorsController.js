const AppError = require('../utils/appError');

const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.value} from ${err.path}`;
  return new AppError(message, 404);
};

const handleDuplicateNameDB = (err) => {
  const value =
    (err.keyValue && Object.values(err.keyValue)[0]) ||
    (err.message && (err.message.match(/(["'])(\\?.)*?\1/) || [])[0]) ||
    'provided value';
  const message = `The tour with that name: ${value} already exists`;
  return new AppError(message, 400);
};

const handleJwtValidation = () =>
  new AppError('Invalid token, please log in again', 401);

const handleJwtExpired = () =>
  new AppError('Token has been expired, please log in again', 401);

const handleValidateErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid inputs data: ${errors.join('. ')}`;
  return new AppError(message, 400);
};

const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    err: err,
    message: err.message,
    stack: err.stack,
    code: err.code,
  });
};

const sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    res.status(500).json({
      status: err,
      message: 'Something went very wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    if (err.name === 'CastError') error = handleCastErrorDB(error);
    if (err.code === 11000) error = handleDuplicateNameDB(error);
    if (err.name === 'ValidationError') error = handleValidateErrorDB(error);
    if (err.name === 'JsonWebTokenError') error = handleJwtValidation();
    if (err.name === 'TokenExpiredError') error = handleJwtExpired();
    sendErrorProd(error, res);
  }
};
