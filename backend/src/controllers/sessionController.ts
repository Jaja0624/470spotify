import axios, {AxiosResponse} from 'axios';
import SessionRooms from '../SessionRoomManager'
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

const unfollowPlaylist = async (accessToken: string, playlistId: string): Promise<AxiosResponse> => {
    const headers = {
        headers: { Authorization: `Bearer ${accessToken}` }
    }
    return await axios.delete(`https://api.spotify.com/v1/playlists/${playlistId}/followers`, headers)
}

const getPlaylistData = async (accessToken: string, playlistId: string): Promise<AxiosResponse> => {
    return await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

// also create admin (TBD)
// 
exports.create = async function (req: any, res: any, next: any) {
    console.log("creating session data", req.body)
    if (!req.body.spotifyId 
        || !req.body.groupUid 
        || !req.body.createSessionInfo 
        || !req.body.accessToken 
        || (!req.body.createSessionInfo.playlistData && req.body.createNewPlaylist === false)) {
        res.status(400)
        res.send('missing or invalid parameters');
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
                                    .insert({is_active:true, group_uid: BigInt(req.body.groupUid), public: req.body.isPublic, description: req.body.description, date_created: new Date()}, 'session_uid');

            // TODO...
            // Create admin
            if (!results) {
                res.status(500)
                res.json('error')
                return;
            } 

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
            io.io().to(parseInt(req.body.groupUid)).emit('updateGroup', results[0])
            io.io().to(parseInt(req.body.groupUid)).emit('updateSessions')

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
    if (!req.body.sessionUid) {
        res.status(400)
        res.send('missing parameters');
        return;
    } 
    console.log("stop session", req.body)
    try {
        const sessions = await db('appsession')
                                .where({session_uid: req.body.sessionUid})
                                .update({is_active: false})
                                .returning('*')

        // IMPORTANT: USE INTEGER FOR ROOM ID
        io.io().to(parseInt(sessions[0].group_uid)).emit('updateGroup', sessions[0])
        io.io().to(parseInt(sessions[0].group_uid)).emit('updateSessions', sessions[0])

        if (req.body.unfollow === true) {
            await unfollowPlaylist(req.body.accessToken, req.body.playlistId)
        }
        if (sessions.length != 0) {
            res.status(200)
            res.json(sessions);
        }
    } catch (err) {
        console.log(err)
        res.status(500)
        res.json('err')
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

exports.activeAll = async function (req: any, res: any, next: any) {
    if (!req.query.accessToken) {
        res.status(400)
        res.json('missing token')
    }
    try {
        const result = await db('appsession as as')
            .where({public: true, is_active: true})
            .join('appgroup as ag', 'as.group_uid', 'ag.group_uid')
            .select('*')
        for (let i = 0; i < result.length; i++) {
            if (result[i].spotify_playlist_uri == null) {
                result.splice(i, 1)
            }
        }
        for (let i = 0; i < result.length; i++) {
            const playlistData: AxiosResponse = await getPlaylistData(req.query.accessToken, result[i].spotify_playlist_uri)    
            result[i]['playlist'] = playlistData.data
            try {
                const usersInSession = SessionRooms.usersInSession(result[i].group_uid.toString())?.allItems();
                result[i]['usersCount'] = usersInSession.length
            } catch (err) {
                // no users in session even though it's active
            }

        }
        res.status(200)
        res.json(result)

    } catch (err) {
        res.status(500)
    }

}





