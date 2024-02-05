const express = require('express');
const morgan = require('morgan');
const AppError = require('./utils/appError');
const globalErrorController = require('./controllers/errorController');

const app = express();
const tourRouter = require('./routes/tourRoutes');
const userRouter = require('./routes/userRoutes');

// MIDDLEWARES
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

app.use(express.json());
app.use(express.static(`${__dirname}/public`));

app.use((req, res, next) => {
  console.log('Hello from the middleware');
  next();
});

app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  next();
});

// ROUTES
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorController);
module.exports = app;
