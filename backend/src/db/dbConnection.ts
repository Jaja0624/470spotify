import Knex from 'knex';
import dotenv from 'dotenv';

// Required to use for process.env variables
dotenv.config();

const DB_HOST : string | undefined = process.env.DB_HOST;
const DB_USER = process.env.DB_USER || 'defaultUser';
const DB_PASS = process.env.DB_PASS || 'defaultPassword';
const DB_NAME = process.env.DB_NAME || 'defaultDatabase';

const DB_SOCKET_PATH = process.env.DB_SOCKET_PATH || '/cloudsql';
const CLOUD_SQL_CONNECTION_NAME = process.env.CLOUD_SQL_CONNECTION_NAME;

// Running locally on Windows uses TCP to connect to the database
const connectWithTcp = (dbHost : string, config : any) => {
    console.log("Connecting with tcp");

    // Extract host and port from socket address
    const dbSocketAddr  = dbHost.split(':'); // e.g. '127.0.0.1:5432'

    // Establish a connection to the database
    return Knex({
        client: 'pg',
        connection: {
            user: DB_USER, // e.g. 'my-user'
            password: DB_PASS, // e.g. 'my-user-password'
            database: DB_NAME, // e.g. 'my-database'
            host: dbSocketAddr[0], // e.g. '127.0.0.1'
            port: dbSocketAddr[1], // e.g. '5432'
        },
        // ... Specify additional properties here.
        ...config,
    });
};

// Running locally on Mac or Linux uses UNIX sockets to connect to the database.
// Running on production (GCP) also uses UNIX sockets,
// (specifically a hostname starting with /cloudsql).
const connectWithUnixSockets = (config : any)=> {
    console.log("Connecting with unix sockets");

    // Establish a connection to the database
    return Knex({
        client: 'pg',
        connection: {
            user: DB_USER, // e.g. 'my-user'
            password: DB_PASS, // e.g. 'my-user-password'
            database: DB_NAME, // e.g. 'my-database'
            host: `${DB_SOCKET_PATH}/${CLOUD_SQL_CONNECTION_NAME}`,
        },
        // ... Specify additional properties here.
        ...config,
    });
};

// Initialize Knex, a Node.js SQL query builder library with built-in connection pooling.
const connect = () => {
    // Configure which instance and what database user to connect with.
    // Remember - storing secrets in plaintext is potentially unsafe. Consider using
    // something like https://cloud.google.com/kms/ to help keep secrets secret.
    const config : any = {pool: {}};
  
    // 'max' limits the total number of concurrent connections this pool will keep. Ideal
    // values for this setting are highly variable on app design, infrastructure, and database.
    config.pool.max = 20;
    // 'min' is the minimum number of idle connections Knex maintains in the pool.
    // Additional connections will be established to meet this value unless the pool is full.
    config.pool.min = 5;
  
    // 'acquireTimeoutMillis' is the number of milliseconds before a timeout occurs when acquiring a
    // connection from the pool. This is slightly different from connectionTimeout, because acquiring
    // a pool connection does not always involve making a new connection, and may include multiple retries.
    // when making a connection
    config.pool.acquireTimeoutMillis = 60000; // 60 seconds

    // 'createTimeoutMillis` is the maximum number of milliseconds to wait trying to establish an
    // initial connection before retrying.
    // After acquireTimeoutMillis has passed, a timeout exception will be thrown.
    config.createTimeoutMillis = 30000; // 30 seconds

    // 'idleTimeoutMillis' is the number of milliseconds a connection must sit idle in the pool
    // and not be checked out before it is automatically closed.
    config.idleTimeoutMillis = 600000; // 10 minutes
  
    // 'knex' uses a built-in retry strategy which does not implement backoff.
    // 'createRetryIntervalMillis' is how long to idle after failed connection creation before trying again
    config.createRetryIntervalMillis = 200; // 0.2 seconds
  
    let knex;
    if (DB_HOST) {
        knex = connectWithTcp(DB_HOST, config);
    } else {
        knex = connectWithUnixSockets(config);
    }
    return knex;
};

const knex = connect();

module.exports = knex;