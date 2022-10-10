const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
// const hashedPass = require('../utils/hashedPassword');
dotenv.config({ path: './config.env' });

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createSendToken = (user, statusCode, res) => {
  const token = signToken(user);
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user,
    },
  });
};

