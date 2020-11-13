import * as db from '../db/dbHelper';

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
            console.log('trx result', result)
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
    
}

exports.members = async function (req : any, res : any, next : any) {
    console.log("groupController exports.members req: " + req + " and " + JSON.stringify(req.body));
    if (!req.body.groupId) {
        res.status(400)
        res.send('missing parameters');
    } else {
        try {
            var result = await db.getAllMembers(req.body.groupId);
            console.log('trx result', result)
            res.json(result);
        } catch (err) {
            console.log(err);
            res.json(err)
        }
    }
    
}