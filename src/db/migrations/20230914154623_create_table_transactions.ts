import { Knex } from "knex";
import db from '../index'


export async function up(knex: Knex): Promise<void> {
    return knex.schema.createTable('transaction', (table) => {
        table.increments('id');
        table.integer('userId').unsigned().notNullable().index();
        table.foreign('userId').references('id').inTable('user').onDelete('cascade');
        table.decimal('balance', 14, 4).defaultTo(0);
        table.decimal('amount', 14, 4).defaultTo(0);
        table.integer('from').unsigned().nullable();
        table.integer('to').unsigned().nullable;
        table.foreign('from').references('id').inTable('user');
        table.foreign('to').references('id').inTable('user');
        table.boolean('external').defaultTo(false);
        table.string('txnType').notNullable();
        table.timestamp('createdAt', {}).notNullable().defaultTo(db.fn.now());
    });
}


export async function down(knex: Knex): Promise<void> {
    return knex.schema.dropTable('transaction');
}



