import axios, {AxiosResponse} from 'axios';
const io = require('../socket')


var db = require('../db/dbConnection');


const getPlaylistTracks = async (accessToken: string, playlistId: string): Promise<AxiosResponse> => {
    return await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

const createPlaylist = async (accessToken: string, playlistName: string, spotifyUid: string): Promise<AxiosResponse> => {
    const headers = {
        headers: { Authorization: `Bearer ${accessToken}` }
    }

    const body = {
        name: playlistName,
        public: false,
        collaborative: true,
    };
    return await axios.post(`https://api.spotify.com/v1/users/${spotifyUid}/playlists`, body, headers)
}

const addTracksToPlaylist = async (accessToken: string, playlistId: string, tracks: string[]): Promise<AxiosResponse> => {
    const headers = {
        headers: { Authorization: `Bearer ${accessToken}` }
    }

    const body = {
        uris:tracks
    };

    return await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, body, headers)
}

// also create admin (TBD)
// 
exports.create = async function (req: any, res: any, next: any) {
    if (!req.body.spotifyId || !req.body.groupUid || !req.body.createSessionInfo || !req.body.accessToken) {
        res.status(400)
        res.send('missing parameters');
    } else {
        try {
            // check if session already exists and is active
            // if so return that session data
            const existingSession = await db('appsession').where({group_uid: BigInt(req.body.groupUid), is_active: true})
            if (existingSession.length != 0) {
                res.status(409)
                res.json(existingSession[0])
                return;
            }

            const results = await db('appsession')
                                    .insert({is_active:true, group_uid: BigInt(req.body.groupUid)}, 'session_uid')
                                    ;
            // TODO...
            // Create admin
            if (!results) {
                return;
            }
            console.log("CREATE SESSION RESULT")
            console.log("create session spotify id", req.body.spotifyId);
            console.log("create session access token ", req.body.accessToken);
            console.log("groupuid", req.body.groupUid);
            console.log("createSessionInfo", req.body.createSessionInfo);
            console.log("playlist id", req.body.createSessionInfo.playlistData.id)
            const tracks = await getPlaylistTracks(req.body.accessToken, req.body.createSessionInfo.playlistData.id)
            const trackUris = [];
            for (let i = 0; i < tracks.data.items.length; i++) {
                if (tracks.data.items[i].track) {
                    trackUris.push(tracks.data.items[i].track.uri);
                }
            }
            // console.log("trackUris", trackUris)

            const newPlaylist = await createPlaylist(req.body.accessToken, "cmpt470-playlist-" + results[0], req.body.spotifyId);
            // console.log("newPlaylistId", newPlaylist.data.id)

            await db('appsession').where({session_uid: results[0]}).update({spotify_playlist_uri:newPlaylist.data.id});

            const result = await addTracksToPlaylist(req.body.accessToken, newPlaylist.data.id, trackUris);
            res.status(201);
            res.json({
                'session_uid':results[0],
                'playlist_id': newPlaylist.data.id
            });
        } catch (err) {
            console.log(err)
            res.status(500)
            res.json("oops")
        }
    }
}

// only admin (tbd)
// ends session
// kicks everyone else out of the session 
exports.stop = async function (req : any, res : any, next : any) {
    if (!req.query.sessionUid) {
        res.status(400)
        res.send('missing parameters');
        return;
    } 
    const sessions = await db('appsession')
                    .where({session_uid: req.query.sessionUid})
                    .update({is_active: false})
                    .returning('*')
    
    // IMPORTANT: USE INTEGER FOR ROOM ID
    io.io().to(parseInt(sessions[0].group_uid)).emit('updateGroup', sessions[0])

    if (sessions.length != 0) {
        // io.
        res.json(sessions);
    }
}

// tries to find an active session for this group
// returns array (empty if not found)
exports.active = async function (req : any, res : any, next : any) {
    if (!req.query.spotifyId || !req.query.groupUid) {
        res.status(400)
        res.send('missing parameters');
        return;
    } 
    // todo verify member is in group
    const result = await db('appsession')
                    .where({group_uid: BigInt(req.query.groupUid), is_active: true})
                    .select('*')
    if (result) {
        console.log('active', result[0])
        res.json(result[0]);
    } else {
        res.json("No Session Active");
    }
}





