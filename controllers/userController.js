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
  const token = signToken(user);
  // user.password = undefined;
  // user.password_confirm = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

exports.createUser = catchAsync(async (req, res, next) => {
  const { email, first_name, last_name, password, password_confirm } = req.body;

  if (password !== password_confirm) {
    return next(
      new AppError('password and confirm password did not match', 401)
    );
  }

  const newUser = await db('users').insert({
    email,
    first_name,
    last_name,
    password,
    password_confirm,
  });
  createSendToken(newUser[0], 201, res);
  // } catch (err) {
  //   console.log(err);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  //Check if email and password exist
  if (!email || !password) {
    // throw new Error('Please provide email and password');
    return next(new AppError('Please provide email or password', 404));
  }
  //Check if user exist and password is correct
  const user = (await db('users').where('email', email))[0];
  if (!user || !(password === user.password)) {
    // throw new Error('Wrong user name or password')
    return next(new AppError('Wrong user name or password', 404));
  }
  //if everything is ok, send token to client
  createSendToken(user.id, 200, res);
});

exports.deposit = catchAsync(async (req, res, next) => {
  const user = await db('users').where({ email: req.body.email });
  if (!user) {
    return next(new AppError('User does not exist', 401));
  }

  const { amount } = req.body;
  if (typeof amount === 'string' || amount <= 0) {
    return next(new AppError('invalid amount', 400));
  }
  const newWallet = (user[0].wallet += amount);
  // await db('users').insert()
  await db('users')
    .where({ email: req.body.email })
    .update('wallet', newWallet);
  res.status(200).json({
    status: 'success',
    user,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  //Get the token and check if it is there
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
  //Token verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //Check if user still exists
  // console.log(decoded);
  const currentUser = await db('users').where('id', decoded.id);
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
  // console.log(currentUser);
  req.user = currentUser;

  next();
});

exports.withdraw = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const user = req.user;

  if (typeof amount === 'string' || amount < 0) {
    return next(new AppError('Enter a valid amount'), 404);
  }
  if (amount > user[0].wallet) {
    return next(new AppError('Insufficient fund'), 404);
  }
  const wallet = (user[0].wallet -= amount);
  // res.status(200).json({
  //   status: 'success',
  //   message: `${amount} sucessfully witdrawn`,
  //   walletBalance: `${wallet}`,
  // });\

  await db('users')
    .where({ email: req.user[0].email })
    .update('wallet', wallet);
  res.status(200).json({
    status: 'success',
    message: `${amount} sucessfully witdrawn`,
    walletBalance: `${wallet}`,
  });
});

// exports.transfer = catchAsync(async (req, res, next) => {
//   const {email, amount} = req.body;
//   const user = req.user;
//   if(!user){
//     return next(new AppError('Your are not logged in',404))
//   }
//   if(!email || !amount){
//     return next(new AppError('Enter beneficiary email and amount'))
//   }
//   if(amount > user[0].wallet){
//     return next(new AppError('insufficient fund',401))
//   }
//   console.log(user)
// });
