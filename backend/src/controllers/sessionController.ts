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
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body
    })
}

const addTracksToPlaylist = async (accessToken: string, playlistId: string, tracks: string[]): Promise<AxiosResponse> => {
    const body = {
        uris: tracks
    }
    return await axios.post(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        },
        body
    })
}

// also create admin
exports.create = async function (req: any, res: any, next: any) {
    if (!req.body.spotifyId || !req.body.groupUid || !req.body.createSessionInfo || !req.body.accessToken) {
        res.status(400)
        res.send('missing parameters');
    } else {
        const results = await db('appsession').insert({is_active:true}, 'session_uid');
        // TODO...
        // Create admin
        if (!results) {
            return;
        }
        console.log("create session spotify id", req.body.spotifyId);
        console.log("groupuid", req.body.groupUid);
        console.log("createSessionInfo", req.body.createSessionInfo);
        console.log("playlist id", req.body.createSessionInfo.playlistData.id)
        // const tracks = await getPlaylistTracks(req.body.accessToken, req.body.createSessionInfo.playlistData.id)
        // const trackUrls = [];
        // for (let i = 0; i < tracks.items.length; i++) {
        //     trackUrls.push(tracks.items[0].url);
        // }
        // const newPlaylist = await createPlaylist(req.body.accessToken, "cmpt470-playlist-" + results[0], req.body.spotifyId);
        // const tracks = await getPlaylistTracks(req.body.accessToken, req.body.createSessionInfo.playlistData.id)
        // const result = await addTracksToPlaylist(req.body.accessToken, newPlaylist.id, trackUrls);
        // res.status(201);
        // res.json({
        //     'session_uid':results[0],
        //     'playlist_id': newPlaylist.id
        // });

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


