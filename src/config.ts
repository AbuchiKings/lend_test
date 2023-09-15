import dotenv from 'dotenv'
dotenv.config()

import { cleanEnv, str, port, num } from "envalid";

const env = cleanEnv(process.env, {
  NODE_ENV: str({
    choices: ['development', 'staging', 'production', 'test']
  }),
  PORT: port({ default: 8000 }),
  SALT: num(),
  JWT_KEY: str(),
  DB_TYPE: str(),
  DB_PORT: num(),
  DB_USER: str(),
  DB_PASS: str(),
  DB_NAME: str(),
  DB_HOST: str(),
  REDIS_URL: str(),
  WHITELIST: str(),
});

export default env;
