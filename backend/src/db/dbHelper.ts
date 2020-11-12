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
    console.log("dbHelper: createGroup");
    db.transaction(function(trx : any) {
        db('appgroup')
        .insert({group_name: groupName})
        .transacting(trx)
        .returning('group_uid')
        .then(function(groupUid : bigint) {
            console.log("group_uid: " + groupUid + " type: " + typeof(BigInt(groupUid)));
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
