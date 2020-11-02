import dotenv from 'dotenv';

dotenv.config();

const DATABASE_HOST = process.env.DATABASE_HOST || 'defaultHost';
const DATABASE_USERNAME = process.env.DATABASE_USERNAME || 'defaultUser';
const DATABASE_PORT = process.env.DATABASE_PORT || '5000';
const DATABASE_PASSWORD = process.env.DATABASE_PASSWORD || 'defaultPassword';
const DATABASE_NAME = process.env.DATABASE_NAME || 'defaultDatabase';
const SERVER_PORT = process.env.SERVER_PORT || '5000';

/* Provides a centralized location for the values and defaults of the environment variables for the server */
export default{
    database: {
        host: DATABASE_HOST,
        user: DATABASE_USERNAME,
        password: DATABASE_PASSWORD,
        port: DATABASE_PORT,
        databaseName: DATABASE_NAME
    },
    server:{
        port: SERVER_PORT
    }
}