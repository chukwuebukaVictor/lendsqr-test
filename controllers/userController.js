const bcrypt = require('bcryptjs');
const db = require('../knex/knex');
const { createSendToken } = require('../utils/authToken');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const hashedPass = require('../utils/hashedPassword');
const {
  createAccount,
  fetchUserByEmail,
  userDeposit,
  userWithdraw,
  userTransfer,
  fetchUserByAccountNumber,
} = require('../service/userService');
// const { config } = require('dotenv');

exports.createUser = catchAsync(async (req, res, next) => {
  let { email, first_name, last_name, password, password_confirm } = req.body;

  if (password !== password_confirm) {
    return next(
      new AppError('password and confirm password did not match', 401)
    );
  }

  const hashedPassword = await hashedPass(password);
  const user = await createAccount(
    email,
    first_name,
    last_name,
    hashedPassword
  );
  createSendToken(user, 201, res);
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email or password', 400));
  }
  const user = await fetchUserByEmail(email);

  if (!user || !(await bcrypt.compare(password, user.password))) {
    return next(new AppError('Wrong user name or password', 401));
  }

  createSendToken({ id: user.id, number: user.number }, 200, res);
});

exports.deposit = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const { id, balance, number: account_number } = req.user;

  if (typeof amount === 'string' || amount <= 0) {
    return next(new AppError('invalid amount', 400));
  }

  await userDeposit(id, account_number, amount);

  res.status(200).json({
    status: 'success',
    message: `${amount} successfully deposited`,
    walletBalance: `${balance + amount}`,
  });
});

exports.withdraw = catchAsync(async (req, res, next) => {
  const { amount } = req.body;
  const { id, balance, number: account_number } = req.user;

  if (typeof amount === 'string' || amount < 0) {
    return next(new AppError('Enter a valid amount'), 404);
  }
  if (amount > balance) {
    return next(new AppError('Insufficient fund'), 404);
  }

  await userWithdraw(id, account_number, amount);

  res.status(200).json({
    status: 'success',
    message: `${amount} sucessfully withdrawn`,
    walletBalance: `${balance - amount}`,
  });
});

exports.transfer = catchAsync(async (req, res, next) => {
  const { recipient: recipient_account_number, amount } = req.body;
  const { id, number, balance } = req.user;
  if (!number || !amount) {
    return next(
      new AppError('Enter beneficiary account number and amount', 400)
    );
  }

  if (typeof amount === 'string') {
    return next(new AppError('amount should be number', 400));
  }

  if (amount > balance) {
    return next(new AppError('insufficient fund', 403));
  }

  const recipient = await fetchUserByAccountNumber(recipient_account_number);
  if (!recipient) {
    return next(new AppError('Recipient does not exist', 404));
  }

  await userTransfer(id, recipient.id, amount);

  res.status(200).json({
    status: 'success',
    message: `${amount} sucessfully transfered ${recipient.first_name} ${recipient.last_name}`,
    walletBalance: `${balance - amount}`,
  });
});
