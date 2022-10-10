const db = require('../knex/knex');

exports.saveUser = async (email, first_name, last_name, password) => {
  return await db('users').insert({
    email,
    first_name,
    last_name,
    password,
  });
};

exports.logUser = async (email) => {
  return (await db('users').where('email', email))[0];
};

exports.userDeposit = async (req,amount) => {
    const user = await db('users').where({ email: req.body.email });
    // const {amount}   = req.body;

  if (!user) {
    return next(new AppError('User does not exist', 401));
  }

  const newWallet = (user[0].wallet += amount);
  return await db('users')
    .where({ email: req.body.email })
    .update('wallet', newWallet);

}

exports.userWithdraw = async(req,user,amount,wallet) => {

    await db('users')
    .where({ email: req.user[0].email })
    .update('wallet', wallet);
}

