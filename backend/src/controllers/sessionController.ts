import Knex from "knex";
import axios, {AxiosResponse} from 'axios';
var db = require('../db/dbConnection');

const getPlaylistTracks = async (accessToken: string, playlistId: string): Promise<AxiosResponse> => {
    return await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        }
    })
}

const createPlaylist = async (accessToken: string, playlistName: string, spotifyUid: string): Promise<AxiosResponse> => {
    const body = {
        name: playlistName,
        public: false,
        collaborative: true,
        description: "yeet"
    }
    return await axios.post(`https://api.spotify.com/v1/users/${spotifyUid}/playlists`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`
        },
        body
    })
}

// also create admin
exports.create = async function (req: any, res: any, next: any) {
    if (!req.body.spotifyId || !req.body.groupUid || !req.body.createSessionInfo) {
        res.status(400)
        res.send('missing parameters');
    } else {
        console.log("create session spotify id", req.body.spotifyId);
        console.log("groupuid", req.body.groupUid);
        console.log("createSessionInfo", req.body.createSessionInfo);
        for (let i = 0; i < req.body.createSessionInfo.playlistData.items.length; i++) {
            console.log(req.body.createSessionInfo.playlistData.items[0].track.name)
            console.log(req.body.createSessionInfo.playlistData.items[0].track.url)
        }
    }
    // TODO...
    // Create admin
    // Setup playlist (create via spotify api)
    // Return success/failure, playlist (playlist URI, client will request the playlist info via spotify API using URI)
    const results = await db('appsession').insert({is_active:true}, 'session_uid');
    if (results) {
        res.status(201);
        res.json({'session_uid':results[0]});
    }
}

// only admin
exports.stop = async function (req : any, res : any, next : any) {
    if (!req.query.sessionUid) {
        res.status(400)
        res.send('missing parameters');
        return;
    } 
    const result = await db('appsession')
                    .where({session_uid: req.query.sessionUid})
                    .update({is_active: false})
    if (result) {
        res.json(result);
    }
}


