import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import querystring from 'querystring';
import cookieParser from 'cookie-parser';
import request from 'request';
var db = require('./db/dbConnection');

// Required to use for process.env variables
dotenv.config();

const BACKEND_PORT = '8080';

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

// Create a group associated with a specfic Spotify user
// Insert a group_name into the 'appgroup' table and
// insert a group_uid into the 'groupmember' table.
// Both inserts should happen, or not at all.
const createGroup = async (db : any, groupName : string, spotifyUid : string) => {
    db.transaction(function(trx : any) {
        db('appgroup')
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

const getAllGroup = async (db : any) => {
    return await db
      .select('*')
      .from('appgroup')
};

// Grab all groups from a user
const getUserGroup = async (db : any, spotifyUid : string) => {

    return await db('appgroup as ag')
                 .join('groupmember as gm', 'gm.group_uid', 'ag.group_uid')
                 .select('ag.group_uid', 'ag.group_name')
                 .where({spotify_uid : spotifyUid});

    // return await db.raw(`
    //     select ag.group_uid, ag.group_name
    //     from AppGroup ag
    //     join groupmember gm on ag.group_uid = gm.group_uid
    //     where gm.spotify_uid = '${spotifyUid}'
    // `);
};

// adds a user to the appuser table
const addUser = async (db : any, spotifyUid : string, publicName : string) => {
    return await db.raw(`
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
        var result = await getAllGroup(db);
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
        var result = await createGroup(db, req.body.groupName, "prq2vz0ahfeet3o4lsonysgjn");
        console.log(result)
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err)
    }
});

// gets all the groups associated with a spotify_uid
app.get('/api/group/user', async (req, res) => {
    console.log('api/group/user called');
    console.log(req.query);
    try {
        var result = await getUserGroup(db, req.query.id as string);
        // console.log("getUserGroup result: " + JSON.stringify(result));
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
        var result = await getAllGroup(db);
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
                    var result = await addUser(db, body.id, body.display_name);
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