const express = require('express');
const globalErrorHandler = require('./controllers/errorController');
const app = express();

const userRouter = require('./routes/transactionRoute');

app.use(express.json());

app.use('/api/v1/user', userRouter);

// app.use((err, req, res, next) => {
//     err.statusCode = err.statusCode || 500;
//     err.status = err.status || 'Error';
  
//     res.status(err.statusCode).json({
//       status: err.status,
//       message: err.message,
//     });
//   });
app.use(globalErrorHandler)

module.exports = app


