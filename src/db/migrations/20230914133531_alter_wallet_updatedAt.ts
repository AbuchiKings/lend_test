import { Knex } from "knex";
import db from '../index'


export async function up(knex: Knex): Promise<void> {
   return knex.schema.alterTable('wallet', function (table) {
        table.timestamp('updatedAt').defaultTo(db.fn.now());
    })
}


export async function down(knex: Knex): Promise<void> {
   return knex.schema.alterTable('wallet', function (table) {
        table.dropColumn('updatedAt')
    })
}

