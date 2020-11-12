import * as db from '../db/dbHelper';

// Retrieve all groups for a specficied user
exports.groups = async function (req : any, res : any, next : any) {
    console.log("userController exports.groups req: " + req);
    try {
        var result = await db.getAllGroups(req.query.id as string);
        console.log("getAllGroups result: " + JSON.stringify(result));
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err)
    }
}
