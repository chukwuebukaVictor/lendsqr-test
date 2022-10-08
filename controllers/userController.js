const { promisify } = require('util');
const db = require('../knex/knex');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

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

exports.createUser = async (req, res, next) => {
  try {
    const { email, first_name, last_name } = req.body;

    if (password !== password_confirm) {
      console.log('password and confirm password did not match');
    }

    const newUser = await db('users').insert({
      email,
      first_name,
      last_name,
      // password,
      // password_confirm,
    });
    createSendToken(newUser, 201, res);
  } catch (err) {
    console.log(err);
  }
};

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  //Check if email and password exist
  if (!email || !password) {
    // return next(new AppError('Please provide email and password', 400));
    console.log('Please provide email and password');
  }
  //Check if user exist and password is correct
  const user = (await db('users').where({ email }).select('password'))[0];
  console.log(user);
  console.log(password, user.password);

  if (!user || !(password === user.password)) {
  // return next(new AppError('Incorrect email or password!', 401));
  console.log('Incorrect email or password!')
  }
  //if everything is ok, send token to client
  createSendToken(user, 200, res);
};

exports.protect = async (req, res, next) => {
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
    // return next(
    //   new AppError('You are not logged in! Please log in to get access', 401)
    // );
    console('You are not logged in! Please log in to get access');
  }
  //Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //Check if user still exists
  const currentUser = await db('users').where(id, decoded.id);
  if (!currentUser) {
    return next(
      // new AppError('The user belonging to this  token no longer exist', 401)
      console.log('The user belonging to this  token no longer exist')
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
};
