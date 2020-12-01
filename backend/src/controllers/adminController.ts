import * as db from '../db/dbHelper';

exports.login = async function (req : any, res : any, next : any) {
    try {
        var result = await db.getAdminCredentials(req.body.password);
        res.status(200);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
}
