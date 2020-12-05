import * as db from '../db/dbHelper';
import SSEManagerInstance from '../SSEClientManager'
import SessionRooms from '../SessionRoomManager'
import LoggedInClients from '../LoggedInSocketClients'
import axios, {AxiosResponse} from 'axios';
const io = require('../socket')

exports.create = async function (req : any, res : any, next : any) {
    console.log("groupController exports.create req: " + req + " and " + JSON.stringify(req.body));
    if (!req.body.groupName || !req.body.id) {
        res.status(400)
        res.send('missing parameters');
    } else {
        try {
            var result = await db.createGroup(req.body.groupName, req.body.id);
            console.log('trx result', result)
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
    
}

exports.join = async function (req : any, res : any, next : any) {
    console.log("groupController exports.create req: " + req + " and " + JSON.stringify(req.body));
    if (!req.body.groupId || !req.body.spotifyId) {
        res.status(400)
        res.send('missing parameters');
    } else {
        try {
            var result = await db.joinGroup(req.body.groupId, req.body.spotifyId);
            const groupMembers = await db.getAllMembers(req.body.groupId);
            // get spotify_uids as list
            const groupMembersIdArray = groupMembers.map((mem: any) => mem.spotify_uid);
            // tell everyone in this group to update groups
            // SSEManagerInstance.sendMessage(groupMembersIdArray, 'a user just joined ur group man', 'updateGroup');
            io.io().join(parseInt(req.body.groupId))
            io.io().to(parseInt(req.body.group_uid)).emit('updateMembers')
            io.io().to(parseInt(req.body.group_uid)).emit('updateSessions')

            console.log('trx result', result)
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
}

exports.leave = async function (req : any, res : any, next : any) {
    console.log("groupController exports.leave req: " + req + " and " + JSON.stringify(req.body));
    if (!req.body.groupId || !req.body.spotifyId) {
        res.status(400)
        res.send('missing parameters');
    } else {
        try {
            var result = await db.leaveGroup(req.body.groupId, req.body.spotifyId);
            const groupMembers = await db.getAllMembers(req.body.groupId);
            // get spotify_uids as list
            const groupMembersIdArray = groupMembers.map((mem: any) => mem.spotify_uid);
            // tell everyone in this group to update groups
            SSEManagerInstance.sendMessage(groupMembersIdArray, 'a user just left ur group man', 'updateGroup');
            console.log('trx result', result)
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
}

interface userData {
    spotify_uid: string,
    pro_pic: string // url
}

exports.members = async function (req : any, res : any, next : any) {
    console.log("groupController exports.members req")
    console.log('params', req.params) 
    if (!req.query.groupId) {
        res.status(400)
        res.send('missing parameters');
    } else {
        try {
            var result = await db.getAllMembers(req.query.groupId);
            if (result.length != 0) {
                const groupId = result[0].group_uid
                const usersInSession = SessionRooms.usersInSession(groupId)?.allItems();
                console.log("users in session", usersInSession);
                for (let i = 0; i < result.length; i++) {
                    if (usersInSession && usersInSession.includes(result[i].spotify_uid)) {
                        result[i].in_session = true
                    }
                    
                    const userLoggedIn: userData | undefined = LoggedInClients.getUser(result[i].spotify_uid)
                    if (userLoggedIn) {
                        result[i].pro_pic = userLoggedIn!.pro_pic
                        result[i].online = true
                    } else {
                        result[i].online = false
                    }
                }
            }
            console.log('trx result', result)
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
    
}

//Interface of a Song item
interface Song {
    date_added: Date,
    app_user: string,
    songname : string,
    song_uri : string,
    group_name: string
}


//Interface of a SessionPlaylist item
export default interface SessionPlaylist {
    session_uid: number,
    start_date: Date,
    participants: String,
    songs: Array<Song>
}

//Gets all the history session playlist of a group based purely on the app session
exports.historySessionPlaylists = async function (req : any, res : any, next : any) {
    console.log("groupController exports.historySessionPlaylists");
    console.log('params', req.params);
    if (!req.query.groupId) {
        res.status(400);
        res.send('missing parameters');
    } else {
        try {
            var result = await db.getSessionPlaylist(req.query.groupId);

            var playlists: Array<SessionPlaylist> = [];
            if (result.rows.length != 0){

                //process each result from the appsession
                for(let i = 0; i < result.rows.length; i++){
                    var row = result.rows[i];

                    //find the details of each playlist uri
                    var playlistItem = await axios.get(`https://api.spotify.com/v1/playlists/${row.spotify_playlist_uri}/tracks`, {
                        headers: {
                            'Authorization': `Bearer ${req.query.accessToken}`
                        }
                    })

                    var songs: Array<Song> = [];
                    //format each of the songs into the interface
                    for(let j = 0; j < playlistItem.data.items.length; j++){
                        var item = playlistItem.data.items[j];

                        //get all the names of the artists
                        var artists = "";
                        for(let k = 0; k < item.track.artists.length; k++){
                            artists += item.track.artists[k].name + ", ";
                        }
                        artists = artists.slice(0, -1);
                        var songname = `${item.track.name} - ${artists.slice(0, -1)}`;

                        //append the song
                        songs.push({
                            date_added: item.added_at,
                            app_user: "",//keep this empty for now
                            songname : songname,
                            song_uri : item.track.uri,
                            group_name: ""//keep this empty for now
                        });
                    }
                    
                    //format each playlist into the interface
                    playlists.push({
                        session_uid: row.session_uid,
                        start_date: row.date_start,
                        participants: "",
                        songs: songs
                    });
                }
            }
            console.log('playlists size', playlists.length);
            res.json(playlists);
            
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
    
}