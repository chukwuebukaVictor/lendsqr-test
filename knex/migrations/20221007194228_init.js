const { randomUUID } = require('crypto');

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = async function (knex) {
  await knex.schema.createTable('users', (table) => {
    table.uuid("id").primary();
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.string('email').notNullable().unique();
    table.string('password').notNullable();
  });

  await knex.schema.createTable('accounts', (table) => {
    table.string('number').primary();
    table.integer('balance').defaultTo(0);
    table.uuid('user_id').unique().references('users.id').onDelete('CASCADE');
  });

  await knex.schema.createTable('transactions', (t) => {
    t.uuid('id').primary();
    t.bigInteger('sender').notNullable();
    t.bigInteger('recipient').notNullable();
    t.integer('amount').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = async function (knex) {
  await knex.schema.dropTableIfExists('accounts');
  await knex.schema.dropTableIfExists('users');
  await knex.schema.dropTableIfExists('transactions');
};