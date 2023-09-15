import dotenv from 'dotenv'
dotenv.config({ path: '../../.env' })

import type { Knex } from "knex";
console.log('This is the db name:', process.env.DB_NAME)
const config: { [key: string]: Knex.Config } = {
  development: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: "knex_migrations"
    },
    //debug: true
  },
  production: {
    client: 'mysql2',
    connection: {
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER,
      database: process.env.DB_NAME,
      password: process.env.DB_PASS
    },
    pool: {
      min: 2,
      max: 10,
      afterCreate: function () {
        console.log('Database connected.')
      }
    },
    migrations: {
      tableName: "knex_migrations"
    }
  }

};

export default config;
