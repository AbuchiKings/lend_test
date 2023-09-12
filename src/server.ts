
require('dotenv').config();

import http from 'http';
import app from './app';

import env from './config'
const server = http.createServer(app);

server.listen(env.PORT, () => {
    console.log(`\n✔ Server is listening on port ${env.PORT} on: `); // eslint-disable-line
    console.log(`  localhost: http://localhost:$${env.PORT}`); // eslint-disable-line
});

process.on('unhandledRejection', (error) => {
    // eslint-disable-next-line
    console.log(error)
    server.close(() => {
        process.exit(1);
    });
});

process.on('SIGINT', () => {
    server.close(() => {
        // eslint-disable-next-line
        console.log('Process terminated!')
        process.exit();
    });
});

process.on('uncaughtException', (error) => {
    // eslint-disable-next-line
    console.log(error)
    server.close(() => {
        process.exit(1);
    });
});