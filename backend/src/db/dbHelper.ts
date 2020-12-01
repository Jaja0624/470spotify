var db = require('./dbConnection');

export async function getAllGroups(spotifyUid : string) {
    console.log("dbHelper: getAllGroups");
    return await db('appgroup as ag')
                 .join('groupmember as gm', 'gm.group_uid', 'ag.group_uid')
                 .select('ag.group_uid', 'ag.group_name')
                 .where({spotify_uid : spotifyUid});
}

export async function getAll() {
    console.log("dbHelper: getAll");
    return await db
                 .select('*')
                 .from('appgroup')
}

export async function addUser(spotifyUid : string, displayName : string) {
    console.log("dbHelper: addUser");
    return await db.raw(`
        insert into AppUser (spotify_uid, public_name)
        select '${spotifyUid}', '${displayName}'
        where not exists (
            select spotify_uid from AppUser 
            where spotify_uid = '${spotifyUid}'
        )
    `);
}

export async function createGroup(groupName : string, spotifyUid : string) {
    console.log("spotifyUid", spotifyUid);
    console.log("dbHelper: createGroup");
    return await db.transaction(function(trx : any) {
        db('appgroup')
        .insert({group_name: groupName})
        .transacting(trx)
        .returning('group_uid')
        .then(function(groupUid : bigint) {
            console.log("group_uid: " + groupUid + " type: " + typeof(BigInt(groupUid)), spotifyUid);
            return trx('groupmember')
                   .insert({group_uid: BigInt(groupUid), spotify_uid: spotifyUid})
        })
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err : any) => {
        console.log("Error in createGroup: " + err);
  });
}

export async function joinGroup(groupUid : string, spotifyUid : string) {
    console.log("spotifyUid", spotifyUid);
    return await db.transaction(function(trx : any) {
        db('groupmember')
        .insert({group_uid: BigInt(groupUid), spotify_uid: spotifyUid})
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err : any) => {
        console.log("Error in joinGroup: " + err);
  });
}

export async function leaveGroup(groupUid : string, spotifyUid : string) {
    console.log("spotifyUid", spotifyUid);
    return await db.transaction(function(trx : any) {
        db('groupmember')
        .where({group_uid: BigInt(groupUid), spotify_uid: spotifyUid})
        .del()
        .then(trx.commit)
        .catch(trx.rollback);
    })
    .catch((err : any) => {
        console.log("Error in joinGroup: " + err);
  });
}

export async function getAllMembers(groupUid : string) {
    console.log("dbHelper: getAllMembers");
    return await db('groupmember as gm')
                    .where({group_uid: BigInt(groupUid)})
                    .join('appuser as au', 'gm.spotify_uid', 'au.spotify_uid')
                    .select('*')
}

export async function getAdminCredentials(password : string) {
    return await db
                 .select('*')
                 .from('admincredentials')
                 .where({admin_password: password})
}

export async function getAppUser() {
    return await db
                 .select('*')
                 .from('appuser')
}

export async function getAppGroup() {
    return await db
                 .select('*')
                 .from('appgroup')
}

export async function getGroupMember() {
    return await db
                 .select('*')
                 .from('groupmember')
}

export async function getAppSession() {
    return await db
                 .select('*')
                 .from('appsession')
}

export async function getSessionAdmin() {
    return await db
                 .select('*')
                 .from('sessionadmin')
}

export async function getAppHistory() {
    return await db
                 .select('*')
                 .from('apphistory')
}
