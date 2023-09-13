import dotenv from 'dotenv'
import { createClient } from 'redis';

dotenv.config();

const client = createClient({
    url: process.env.REDIS_URL,
    socket: {
        reconnectStrategy: retries => Math.min(retries * 50, 1000)
    },
});

(async () => {
    await client.connect();
})();

client.on('connect', () => {
    // eslint-disable-next-line
    console.log('Connected to redis server');
    return;
});

client.on('error', (error) => {
    // eslint-disable-next-line
    console.log(`Redis server error: ${error}`);
    return;
});

export default client;