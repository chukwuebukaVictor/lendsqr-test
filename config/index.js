require('dotenv').config();


const { NODE_ENV, PORT, JWT_SECRET, JWT_EXPIRES_IN,DB_PASSWORD, HOST } = process.env;

['JWT_SECRET', 'JWT_EXPIRES_IN', 'NODE_ENV'].forEach((key) => {
  if (process.env[key] === undefined) throw new Error(`${key} is required`);
});
module.exports = { NODE_ENV, PORT, JWT_SECRET, JWT_EXPIRES_IN, DB_PASSWORD, HOST };
