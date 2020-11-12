import * as db from '../db/dbHelper';

exports.create = async function (req : any, res : any, next : any) {
    console.log("groupController exports.create req: " + req + " and " + JSON.stringify(req.body));
    try {
        var result = await db.createGroup(req.body.groupName, req.body.id);
        console.log(result)
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err)
    }
}
