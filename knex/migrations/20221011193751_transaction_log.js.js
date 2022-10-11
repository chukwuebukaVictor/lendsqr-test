/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
 exports.up = function (knex) {
    return knex.schema.createTable('transactions', (t) => {
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
  exports.down = function (knex) {
    return knex.schema.dropTableIfExists('transactions');
  };
  