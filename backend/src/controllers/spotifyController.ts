import * as db from '../db/dbHelper';
import dotenv from 'dotenv';
import querystring from 'querystring';
import request from 'request';

// Required to use for process.env variables
dotenv.config();

const BACKEND_REDIRECT = process.env.BACKEND_REDIRECT || 'http://cmpt470-proj.appspot.com';
const FRONTEND_REDIRECT = process.env.FRONTEND_REDIRECT || '';

var stateKey = 'spotify_auth_state';

// Spotify variables
var client_id = 'c29ee1e218a5424f862bf1a828a7b982'; // Your client id
var client_secret = '0106186e5042431b8e45639d76241338'; // Your secret
var redirect_uri = BACKEND_REDIRECT + '/api/spotify/callback'; // Your redirect uri

var generateRandomString = function(length : any) {
    var text = '';
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
};

exports.login = async function (req : any, res : any, next : any) {
    console.log("spotifyController exports.login req: " + req);

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
        })
    );
}

exports.callback = async function (req : any, res : any, next : any) {
    console.log("spotifyController exports.callback req: " + req);
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
            	'Authorization': 'Basic ' + Buffer.from(client_id + ':' + client_secret).toString('base64')
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
                    var result = await db.addUser(body.id, body.display_name);
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
}