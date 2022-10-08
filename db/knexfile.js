// Update with your config settings.

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      database: 'Bank-App',
      host: "localhost",
      user: 'root',
      password: 'Test@123',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
  },
};
