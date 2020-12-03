import * as db from '../db/dbHelper';
import SSEManagerInstance from '../SSEClientManager'
import SessionRooms from '../SessionRoomManager'
import LoggedInClients from '../LoggedInSocketClients'
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

//Gets all the history session playlist of a group
exports.historySessionPlaylists = async function (req : any, res : any, next : any) {
    console.log("groupController exports.historySessionPlaylists");
    console.log('params', req.params);
    if (!req.query.groupId) {
        res.status(400);
        res.send('missing parameters');
    } else {
        try {
            var result = await db.getGroupPlaylists(req.query.groupId);
            console.log(result);
            var playlists : Array<SessionPlaylist> = [];
            if (result.rows.length != 0) {
                var currentSessionUID = -1;

                for(let i = 0; i < result.rows.length; i++){
                    var row = result.rows[i];
                    if(playlists.length == 0 || row.session_uid != currentSessionUID){
                        playlists.push({
                            session_uid : row.session_uid,
                            start_date : row.date_start,
                            participants : row.participants,
                            songs : [{
                                date_added: row.date_added,
                                app_user: row.public_name,
                                songname : "placeholder",
                                song_uri : row.song_uri,
                                group_name: row.group_name
                            }]
                        });
                        console.log(playlists);
                        currentSessionUID = row.session_uid;
                    }
                    else{
                        playlists[playlists.length - 1].songs.push({
                            date_added: row.date_added,
                            app_user: row.public_name,
                            songname : "placeholder",
                            song_uri : row.song_uri,
                            group_name: row.group_name
                        });
                    }
                }
            }
            console.log('playlists result', playlists);
            res.json(playlists);
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
    
}