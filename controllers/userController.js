const { promisify } = require('util');
const db = require('../knex/knex');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');

dotenv.config({ path: './config.env' });

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  user.password = undefined;
  user.password_confirm = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.createUser = catchAsync(async (req, res, next) => {
  const { email, first_name, last_name } = req.body;

  if (password !== password_confirm) {
    return next(
      new AppError('password and confirm password did not match', 400)
    );
  }

  const newUser = await db('users').insert({
    email,
    first_name,
    last_name,
    // password,
    // password_confirm,
  });
  createSendToken(newUser, 201, res);
  // } catch (err) {
  //   console.log(err);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exist
  if (!email || !password) {
    return next(new AppError('Please provide email and password', 400));
  }
  //Check if user exist and password is correct
  const user = (await db('users').where({ email }).select('password'))[0];

  if (!user || !(password === user.password)) {
    return next(new AppError('Incorrect email or password!', 401));
  }
  //if everything is ok, send token to client
  createSendToken(user, 200, res);
});

exports.deposit = async (req, res, next) => {
  try {
    const user = await db('users').where({ email: req.body.email });
    if (!user) {
      return next(new AppError('User does not exist', 401));
    }

    const { amount } = req.body;
    if (amount <= 0) {
      return new error(err);
    }
    const newBalance = (user[0].balance += amount);
    // await db('users').insert()
    await db('users')
      .where({ email: req.body.email })
      .update('balance', newBalance);
    res.status(200).json({
      status: 'success',
      user,
    });
  } catch (error) {}
};

exports.withdraw = async (req, res, next) => {
  
}

exports.protect = catchAsync(async (req, res, next) => {
  //Get the token and check if it is there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  console.log(token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }
  //Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //Check if user still exists
  const currentUser = await db('users').where(id, decoded.id);
  if (!currentUser) {
    return next(
      new AppError('The user belonging to this  token no longer exist', 401)
    );
  }
  //Check if user changed password after the token was issued
  // if (await currentUser.changedPasswordAfter(decoded.iat)) {
  //   return next(
  //     new AppError('User recently changed password! Please log in again', 401)
  //   );
  // }
  // console.log(await currentUser.changedPasswordAfter(decoded.iat));

  //Grant access to protected route
  req.user = currentUser;
  next();
});
