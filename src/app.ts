import compression from 'compression';
import cors from 'cors';
import express, { Application} from 'express';
import helmet from 'helmet';
import preventParameterPollution from 'hpp'

import db from './db/index'
import env from './config'
import errorHandler from './middlewares/errorHandler'
import v1 from './routes/v1'
import './cache'

console.log(db.name)
const app: Application = express();

const whitelist = env.WHITELIST.length ? env.WHITELIST.split(',') : [];

let options = {
    origin: whitelist,
    credentials: true,
};
app.use('*', cors(options));

app.set('trust proxy', true);

app.use(express.json({ limit: '20kb' }));
app.use(helmet());

app.use(preventParameterPollution());
app.use(compression());

app.use(v1);
app.use(errorHandler);

export default app;