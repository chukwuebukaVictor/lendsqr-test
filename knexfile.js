const { HOST, DB_PASSWORD } = require('./config');

/**
 * @type { Object.<string, import("knex").Knex.Config> }
 */
module.exports = {
  development: {
    client: 'mysql2',
    connection: {
      host: HOST,
      user: 'root',
      password: DB_PASSWORD,
      database: 'Bank-App',
      charset: 'utf8',
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
  },

  production: {
    client: 'pg',
    connection: process.env.DATABASE_URL,
    ssl: { require: true, rejectUnauthorized: false },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
  },

  test: {
    client: 'mysql2',
    connection: {
      host: HOST,
      user: 'root',
      password: DB_PASSWORD,
      database: 'Bank-App',
      charset: 'utf8',
    },
    migrations: {
      directory: __dirname + '/knex/migrations',
    },
  },
};

// const { HOST, DB_PASSWORD } = require('./config');

// /**
//  * @type { Object.<string, import("knex").Knex.Config> }
//  */
// module.exports = {
//   development: {
//     client: 'pg',
//     connection: {
//       host: HOST,
//       user: 'user',
//       password: DB_PASSWORD,
//       database: 'Bank-App',
//       charset: 'utf8',
//     },
//     migrations: {
//       directory: __dirname + '/knex/migrations',
//     },
//   },
//   test: {
//     client: 'pg',
//     connection: {
//       host: HOST,
//       user: 'user',
//       password: DB_PASSWORD,
//       database: 'Bank-App',
//       charset: 'utf8',
//     },
//     migrations: {
//       directory: __dirname + '/knex/migrations',
//     },
//   }
// };
