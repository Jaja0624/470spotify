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

exports.appuser = async function (req : any, res : any, next : any) {
    try {
        var result = await db.getAppUser();
        res.status(200);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
}

exports.appgroup = async function (req : any, res : any, next : any) {
    try {
        var result = await db.getAppGroup();
        res.status(200);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
}

exports.groupmember = async function (req : any, res : any, next : any) {
    try {
        var result = await db.getGroupMember();
        res.status(200);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
}

exports.appsession = async function (req : any, res : any, next : any) {
    try {
        var result = await db.getAppSession();
        res.status(200);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
}

exports.sessionadmin = async function (req : any, res : any, next : any) {
    try {
        var result = await db.getSessionAdmin();
        res.status(200);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
}

exports.apphistory = async function (req : any, res : any, next : any) {
    try {
        var result = await db.getAppHistory();
        res.status(200);
        res.json(result);
    }
    catch (err) {
        console.log(err);
    }
}
