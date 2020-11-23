import * as db from '../db/dbHelper';
import SSEManagerInstance from '../SSEClientManager'

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
            SSEManagerInstance.sendMessage(groupMembersIdArray, 'a user just joined ur group man', 'updateGroup');
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


exports.members = async function (req : any, res : any, next : any) {
    console.log("groupController exports.members req")
    console.log('params', req.params) 
    if (!req.query.groupId) {
        res.status(400)
        res.send('missing parameters');
    } else {
        try {
            var result = await db.getAllMembers(req.query.groupId);
            console.log('trx result', result)
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
    
}

