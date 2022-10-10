const bcrypt = require('bcryptjs');
const db = require('../knex/knex');
const { createSendToken } = require('../utils/authToken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const hashedPass = require('../utils/hashedPassword');
const { saveUser, logUser, userDeposit, userWithdraw } = require('../service/userService');
// const {protect} = require('../utils/authUser')

exports.createUser = catchAsync(async (req, res, next) => {
  let { email, first_name, last_name, password, password_confirm } = req.body;
  if (password !== password_confirm) {
    return next(
      new AppError('password and confirm password did not match', 401)
    );
  }
  const hashedPassword = await hashedPass(password);
  const newUser = await saveUser(email, first_name, last_name, hashedPassword);
  createSendToken(newUser[0], 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError('Please provide email or password', 404));
  }
  const user = await logUser(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong user name or password', 404));
  }
  createSendToken(user.id, 200, res);
});

exports.deposit = catchAsync(async (req, res, next) => {
  // const user = await db('users').where({ email: req.body.email });
  // if (!user) {
  //   return next(new AppError('User does not exist', 401));
  // }
  
  const { amount } = req.body;
  if (typeof amount === 'string' || amount <= 0) {
    return next(new AppError('invalid amount', 400));
  }
  await userDeposit(req,amount);
  // const newWallet = (user[0].wallet += amount);
  // await db('users')
  //   .where({ email: req.body.email })
  //   .update('wallet', newWallet);


  // createSendToken(user[0].id, 200, res);
  res.status(200).json({
    status: 'success',
    message:`${amount} successfully deposited`
  })
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

  // await db('users')
  //   .where({ email: req.user[0].email })
  //   .update('wallet', wallet);
  await userWithdraw(req,user,amount,wallet)
  res.status(200).json({
    status: 'success',
    message: `${amount} sucessfully withdrawn`,
    walletBalance: `${wallet}`,
  });
});

exports.transfer = catchAsync(async (req, res, next) => {
  const { email, amount } = req.body;
  const user = req.user;
  if (!user) {
    return next(new AppError('Your are not logged in', 404));
  }
  if (!email || !amount) {
    return next(new AppError('Enter beneficiary email and amount'));
  }
  if (typeof amount === 'string' || amount > user[0].wallet) {
    return next(new AppError('insufficient fund', 401));
  }

  const beneficiary = (await db('users').where({ email: req.body.email }))[0];
  if (!beneficiary) {
    return next(new AppError('Beneficiary does not exist', 404));
  }
  const beneficiaryWallet = beneficiary.wallet;
  const userWallet = (user[0].wallet -= amount);

  await db('users')
    .where({ email: user[0].email })
    .update('wallet', userWallet);

  await db('users').where({ email }).update('wallet', beneficiaryWallet);

  res.status(200).json({
    status: 'success',
    message: `${amount} sucessfully transfered to ${beneficiary.first_name} ${beneficiary.last_name}`,
    walletBalance: `${userWallet}`,
  });
});
