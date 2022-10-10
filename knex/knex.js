const { NODE_ENV } = require('../config')
const config = require('../knexfile.js')[NODE_ENV];
module.exports = require('knex')(config);