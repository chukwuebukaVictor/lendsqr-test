/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return knex.schema.createTable('users', (table) => {
    table.uuid('id').primary().defaultTo(knex.raw('(UUID())'));
    table.string('first_name').notNullable();
    table.string('last_name').notNullable();
    table.bigInteger('account_number').unique();
    table.string('email').notNullable().unique();
    table.integer('wallet').defaultTo(0);
    table.string('password').notNullable();
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return knex.schema.dropTableIfExists('user');
};
