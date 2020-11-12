var db = require('./dbConnection');

export async function getAllGroups(spotifyUid : string) {
    console.log("dbHelper: getAllGroups");
    return await db('appgroup as ag')
                 .join('groupmember as gm', 'gm.group_uid', 'ag.group_uid')
                 .select('ag.group_uid', 'ag.group_name')
                 .where({spotify_uid : spotifyUid});
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