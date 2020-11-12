import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import Knex from 'knex';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import request from 'request';

// Required to use for process.env variables
dotenv.config();

const DB_HOST : string | undefined = process.env.DB_HOST;
const DB_USER = process.env.DB_USER || 'defaultUser';
const DB_PASS = process.env.DB_PASS || 'defaultPassword';
const DB_NAME = process.env.DB_NAME || 'defaultDatabase';
const BACKEND_PORT = '8080';
const DB_SOCKET_PATH = process.env.DB_SOCKET_PATH || '/cloudsql';
const CLOUD_SQL_CONNECTION_NAME = process.env.CLOUD_SQL_CONNECTION_NAME;
const BACKEND_REDIRECT = process.env.BACKEND_REDIRECT || 'http://cmpt470-proj.appspot.com';
const FRONTEND_REDIRECT = process.env.FRONTEND_REDIRECT || '';

var client_id = 'c29ee1e218a5424f862bf1a828a7b982'; // Your client id
var client_secret = '0106186e5042431b8e45639d76241338'; // Your secret
var redirect_uri = BACKEND_REDIRECT + '/api/spotify/callback'; // Your redirect uri

/*
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function(length : any) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

var stateKey = 'spotify_auth_state';

const app = express();

// Automatically parse request body as form data.
app.enable('trust proxy');
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

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
    config.pool.max = 5;

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

// Create a group associated with a specfic Spotify user
// Insert a group_name into the 'appgroup' table and
// insert a group_uid into the 'groupmember' table.
// Both inserts should happen, or not at all.
const createGroup = async (knex : any, groupName : string, spotifyUid : string) => {
    knex.transaction(function(trx : any) {
        knex('appgroup')
        .insert({group_name: groupName})
        .transacting(trx)
        .returning('group_uid')
        .then(function(groupUid : bigint) {
            console.log("group_uid: " + groupUid + " type: " + typeof(BigInt(groupUid)));
            return trx('groupmember')
                   .insert({group_uid: BigInt(groupUid), spotify_uid: spotifyUid})
        })
        .then(trx.commit)
        .catch(trx.rollback);
  })
  .catch((err : any) => {
    console.log("Error in createGroup: " + err);
  });
};

const getAllGroup = async (knex : any) => {
    return await knex
      .select('*')
      .from('appgroup')
};

// adds a user to the appuser table
const addUser = async (knex : any, spotifyUid : string, publicName : string) => {
    return await knex.raw(`
        insert into AppUser (spotify_uid, public_name)
        select '${spotifyUid}', '${publicName}'
        where not exists (
            select spotify_uid from AppUser 
            where spotify_uid = '${spotifyUid}'
        )
    `);
};

app.post('/api', async function (req, res) {
    console.log('/api called');
    console.log(req.body);
    try {
        var result = await getAllGroup(knex);
        console.log(result);
        res.json(result);
    } catch (err) {
        console.log(err);
        res
          .status(500)
          .send('Unable to load page; see logs for more details.')
          .end();
    }
});

// creates a group
app.post('/api/group/create', async (req, res) => {
    console.log('api/group/create called');
    console.log(req.body);
    try {
        // TODO: replace with spotify_uid from cookies
        var result = await createGroup(knex, req.body.groupName, "prq2vz0ahfeet3o4lsonysgjn");
        console.log(result)
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err)
    }
});

// gets all the groups in the db 
app.get('/api/group/all', async (req, res) => {
    console.log('api/group/all called');
    try {
        var result = await getAllGroup(knex);
        console.log(result)
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err)
    }
});

// Called from Landing.tsx
app.get('/api/spotify/login', function(req, res) {
    console.log('/api/spotify/login called');

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = 'user-read-private user-read-email user-read-playback-state playlist-read-private playlist-read-collaborative';
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
        response_type: 'code',
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state
    }));
});

// Called from /api/spotify/login as a redirect_uri
app.get('/api/spotify/callback', function(req, res) {
    console.log('/api/spotify/callback called');

  // your application requests refresh and access tokens
  // after checking the state parameter
    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('/#' +
            querystring.stringify({
                error: 'state_mismatch'
            })
        );
    } else {
        res.clearCookie(stateKey);
        var authOptions = {
            url: 'https://accounts.spotify.com/api/token',
            form: {
                code: code,
                redirect_uri: redirect_uri,
                grant_type: 'authorization_code'
            },
            headers: {
                'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
            },
            json: true
        };

        request.post(authOptions, function(error : any, response : any, body : any) {
            if (!error && response.statusCode === 200) {

                var access_token = body.access_token,
                    refresh_token = body.refresh_token;

                var options = {
                    url: 'https://api.spotify.com/v1/me',
                    headers: { 'Authorization': 'Bearer ' + access_token },
                    json: true
                };

                // use the access token to access the Spotify Web API
                request.get(options, async function(error : any, response : any, body : any) {
                    console.log(body);
                    // Add spotify_uid and display_name to appuser table
                    var result = await addUser(knex, body.id, body.display_name);
                    console.log(result);
                });

                // we can also pass the token to the browser to make requests from there
                // this is where you get redirected after logging in
                res.redirect(
                    FRONTEND_REDIRECT + '/authloader?' +
                    querystring.stringify({
                        access_token: access_token,
                        refresh_token: refresh_token
                    })
                );
            } else {
                res.redirect('/#' +
                    querystring.stringify({
                        error: 'invalid_token'
                    })
                );
            }
        });
    }
});

app.get('/api/spotify/refresh_token', function(req, res) {
    console.log('/api/spotify/refresh_token called');

    // requesting access token from refresh token
    var refresh_token = req.query.refresh_token;
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        headers: {
            'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64'))
        },
        form: {
            grant_type: 'refresh_token',
            refresh_token: refresh_token
        },
        json: true
    };

    request.post(authOptions, function(error : any, response : any, body : any) {
        if (!error && response.statusCode === 200) {
            var access_token = body.access_token;
            res.send({
                'access_token': access_token
            });
        }
    });
});

const server = app.listen(BACKEND_PORT, () => {
    console.log(`App listening on port ${BACKEND_PORT}`);
    console.log('Press Ctrl+C to quit.');
});