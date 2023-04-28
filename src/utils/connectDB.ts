import mongoose from 'mongoose';
import config from 'config';
import log from './logger';

const dbUrl = `mongodb://${config.get('dbName')}:${config.get(
    'dbPass'
)}@localhost:6000/jwtAuth?authSource=admin`;

mongoose.set('strictQuery', true)
const connectDB = async () => {
    try {
        await mongoose.connect(dbUrl);
        log.info('Database connected...');
    } catch (error: any) {
        log.error(error.message);
        setTimeout(connectDB, 5000);
    }
};

export default connectDB;
