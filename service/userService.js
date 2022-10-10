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

exports.userDeposit = async (user) => await db('users')
//   const user = await db('users').where({ email: req.body.email });
//   if (!user) {
//     return next(new AppError('User does not exist', 401));
//   }

//   return await db('users')
//     .where({ email: req.body.email })
//     .update('wallet', wallet);

