const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const db = require('../knex/knex');
const { JWT_SECRET } = require('../config');
const { fetchUserById } = require('../service/userService');

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, JWT_SECRET);
  const currentUser = await fetchUserById(decoded.id);
  console.log({ decoded, currentUser });
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this  token no longer exist', 401)
    );
  }

  req.user = currentUser;

  next();
});
