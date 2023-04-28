import { createClient } from 'redis';
import log from './logger';

const redisUrl = `redis://localhost:6379`;
const redisClient = createClient({
    url: redisUrl,
});

const connectRedis = async () => {
    try {
        await redisClient.connect();
        log.info('Redis client connected...');
    } catch (err: any) {
        log.info(err.message);
        setTimeout(connectRedis, 5000);
    }
};

connectRedis();

redisClient.on('error', (err) => console.log(err));

export default redisClient;
