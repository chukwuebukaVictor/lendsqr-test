const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const db = require('../knex/knex');


exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return Next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const currentUser = await db('users').where('id', decoded.id);

  if (!currentUser) {
    return next(
      new AppError('The user belonging to this  token no longer exist', 401)
    );
  }

  req.user = currentUser;

  next();
});
