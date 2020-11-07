"use strict";

// Require process, so we can mock environment variables.
const process = require('process');

const express = require('express');
const bodyParser = require('body-parser');
const Knex = require('knex');
const cors = require('cors')

const app = express();
app.enable('trust proxy');

// Automatically parse request body as form data.
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(cors());

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
  res.set('Content-Type', 'text/html');
  next();
});

// [START cloud_sql_postgres_knex_create_tcp]
const connectWithTcp = config => {
    console.log("Connecting with tcp");

    // Extract host and port from socket address
    const dbSocketAddr = process.env.DB_HOST.split(':'); // e.g. '127.0.0.1:5432'

    // Establish a connection to the database
    return Knex({
    client: 'pg',
    connection: {
        user: process.env.DB_USER, // e.g. 'my-user'
        password: process.env.DB_PASS, // e.g. 'my-user-password'
        database: process.env.DB_NAME, // e.g. 'my-database'
        host: dbSocketAddr[0], // e.g. '127.0.0.1'
        port: dbSocketAddr[1], // e.g. '5432'
    },
    // ... Specify additional properties here.
    ...config,
    });
};
// [END cloud_sql_postgres_knex_create_tcp]

// [START cloud_sql_postgres_knex_create_socket]
const connectWithUnixSockets = config => {
    const dbSocketPath = process.env.DB_SOCKET_PATH || '/cloudsql';
    console.log("Connecting with unix sockets");

    // Establish a connection to the database
    return Knex({
    client: 'pg',
    connection: {
        user: process.env.DB_USER, // e.g. 'my-user'
        password: process.env.DB_PASS, // e.g. 'my-user-password'
        database: process.env.DB_NAME, // e.g. 'my-database'
        host: `${dbSocketPath}/${process.env.CLOUD_SQL_CONNECTION_NAME}`,
    },
    // ... Specify additional properties here.
    ...config,
    });
};
// [END cloud_sql_postgres_knex_create_socket]

// Initialize Knex, a Node.js SQL query builder library with built-in connection pooling.
const connect = () => {
  // Configure which instance and what database user to connect with.
  // Remember - storing secrets in plaintext is potentially unsafe. Consider using
  // something like https://cloud.google.com/kms/ to help keep secrets secret.
  const config = {pool: {}};

  // [START cloud_sql_postgres_knex_limit]
  // 'max' limits the total number of concurrent connections this pool will keep. Ideal
  // values for this setting are highly variable on app design, infrastructure, and database.
  config.pool.max = 5;
  // 'min' is the minimum number of idle connections Knex maintains in the pool.
  // Additional connections will be established to meet this value unless the pool is full.
  config.pool.min = 5;
  // [END cloud_sql_postgres_knex_limit]

  // [START cloud_sql_postgres_knex_timeout]
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
  // [END cloud_sql_postgres_knex_timeout]

  // [START cloud_sql_postgres_knex_backoff]
  // 'knex' uses a built-in retry strategy which does not implement backoff.
  // 'createRetryIntervalMillis' is how long to idle after failed connection creation before trying again
  config.createRetryIntervalMillis = 200; // 0.2 seconds
  // [END cloud_sql_postgres_knex_backoff]

  let knex;
  if (process.env.DB_HOST) {
    knex = connectWithTcp(config);
  } else {
    knex = connectWithUnixSockets(config);
  }
  return knex;
};

const knex = connect();

const getStuff = async knex => {
  return await knex
    .select('*')
    .from('appgroup')
    .limit(5);
};

app.post('/api', async function (req, res) {
    console.log('/api called');
    console.log(req.body);

    try {
        var temp = await getStuff(knex);
        console.log(temp);

    } catch (err) {
        console.log(err);
        res
          .status(500)
          .send('Unable to load page; see logs for more details.')
          .end();
    }

    res.status(200).send(temp);
});

const PORT = process.env.PORT || 8080;
const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT}`);
    console.log('Press Ctrl+C to quit.');
});