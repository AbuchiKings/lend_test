import { Knex } from "knex";
import db from '../index'


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('user', (table) => {
        table.increments('id');
        table.string('email').checkLength('<=', 100).notNullable().unique();
        table.string('firstname').notNullable().checkLength('<=', 50);
        table.string('password').notNullable().checkLength('<=', 1000);
        table.timestamp('createdAt', {}).notNullable().defaultTo(db.fn.now());
        table.timestamp('updatedAt', {}).notNullable().defaultTo(db.fn.now());
    }).createTable('wallet', (table) => {
        table.increments('id');
        table.integer('userId').unsigned().notNullable().index();
        table.foreign('userId').references('id').inTable('user').onDelete('cascade');
        table.decimal('balance', 14, 4).defaultTo(0);
        table.timestamp('createdAt', { useTz: false }).notNullable().defaultTo(db.fn.now());

    });
}


export async function down(knex: Knex): Promise<void> {
    await knex.schema.dropTable('wallet');
    await knex.schema.dropTable('user');

}

