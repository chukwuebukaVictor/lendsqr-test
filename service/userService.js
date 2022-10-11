const db = require('../knex/knex');
const { randomUUID } = require('crypto');
const AppError = require('../utils/appError');

saveUser = async (
  email,
  first_name,
  last_name,
  password,
) => {
  return await db('users').insert({
    id: randomUUID(),
    email,
    first_name,
    last_name,
    password,
  }).returning("*");
};

saveAccount = async (
  user_id,
  number,
) => {
  return await db('accounts').insert({
    number,
    user_id,
  }).returning("*");
};

createAccount = async (email, first_name, last_name, hashedPassword) => {
  const account_number = Number(Date.now().toString().slice(3));
  console.log(account_number);

  const [user] = await saveUser(
    email,
    first_name,
    last_name,
    hashedPassword,
  );
  const [account] = await saveAccount(user.id, account_number);

  return {
    id: user.id,
    number: account.number,
  }
}

fetchUserByEmail = async (email) => {
  const [user] = await db('users')
    .join("accounts", "users.id", "accounts.user_id")
    .where("users.email", email);

  return user;
};

fetchUserById = async (id) => {
  const [user] = await db('users')
    .join("accounts", "users.id", "accounts.user_id")
    .where("users.id", id);

  return user;
};

fetchUserByAccountNumber = async (number) => {
  const [user] = await db('users')
    .join("accounts", "users.id", "accounts.user_id")
    .where("accounts.number", number);

  return user;
};

userDeposit = async (user_id, account_number, amount) => {
  await db('accounts')
    .where({ user_id: user_id })
    .increment('balance', amount);

  await logTransaction(account_number, amount);
};

userWithdraw = async (user_id, account_number, amount) => {
  await db('accounts')
    .where({ user_id: user_id })
    .increment('balance', -amount);

  await logTransaction(account_number, amount);
};

userTransfer = async (sender_id, recipient_id, amount) => {
  const trx = await db.transaction();

  try {
    await trx('accounts')
      .where({ user_id: recipient_id })
      .increment('balance', amount);
    await trx('accounts')
      .where({ user_id: sender_id })
      .increment('balance', -amount);
    await trx.commit();
  } catch (error) {
    await trx.rollback(error);
    throw new AppError('Transfer failed! Please try again later', 500);
  }
};

logTransaction = async (recipient, amount, sender = 0) => {
  return await db('transactions').insert({
    id: randomUUID(),
    sender,
    recipient,
    amount
  }).returning("*");
};

module.exports = {
  createAccount,
  fetchUserByEmail,
  fetchUserById,
  userDeposit,
  userWithdraw,
  userTransfer,
}