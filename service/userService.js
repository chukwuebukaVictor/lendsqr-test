const db = require('../knex/knex');

exports.saveUser = async (
  email,
  first_name,
  last_name,
  password,
  account_number
) => {
  return await db('users').insert({
    email,
    first_name,
    last_name,
    password,
    account_number,
  });
};

exports.logUser = async (email) => {
  return (await db('users').where('email', email))[0];
};

exports.userDeposit = async (req, amount) => {
  const user = await db('users').where({
    account_number: req.body.account_number,
  });

  if (!user) {
    return next(new AppError('User does not exist', 401));
  }

  const newWallet = (user[0].wallet += amount);
  return await db('users')
    .where({ account_number: req.body.account_number })
    .update('wallet', newWallet);
};

exports.userWithdraw = async (req, user, amount, wallet) => {
  await db('users')
    .where({ email: req.user[0].email })
    .update('wallet', wallet);
};

exports.userTransfer = async (req, user, account_number, userWallet,amount) => {
  const beneficiary = (
    await db('users').where({ account_number: req.body.account_number })
  )[0];
  if (!beneficiary) {
    return next(new AppError('Beneficiary does not exist', 404));
  }
  
  const newBeneficiaryWallet = beneficiary.wallet +=amount ;
 
  await db('users')
    .where({ account_number: user[0].account_number })
    .update('wallet', userWallet);

  await db('users')
    .where({ account_number })
    .update('wallet', newBeneficiaryWallet);
  return beneficiary;
};
