const db = require('../knex/knex');

exports.createUser = async (req, res, next) => {
  try {
    const { email, first_name, last_name, balance } = req.body;
    const newUser = await db('users').insert({
      email,
      first_name,
      last_name,
    });

    res.status(201).json({
      status: 'success',
      data: {
        user: newUser,
      },
    });
  } catch (err) {
    console.log(err);
  }
};
