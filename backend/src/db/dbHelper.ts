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

/**
 * Gets all session playlist data of a group using the AppHistory table.
 * @param group_uid 
 * 
 * Returns an array of rows with the following format: 
 * {
 *      session_uid : number, 
 *      date_start : date, 
 *      participants : string, 
 *      date_added : date, 
 *      public_name : string, 
 *      spotify_uri : string, 
 *      group_name : string
 * }
 */
export async function getGroupPlaylists(group_uid : number) {
    console.log("dbHelper: getGroupPlaylists");
    return await db.raw(`
        select SessionOverview.session_uid as session_uid, SessionOverview.date_start, SessionOverview.participants, ah2.date_added, au2.public_name, ah2.spotify_uri, ag.group_name
        from (
                select ah1.session_uid, min(ah1.date_added) as date_start, string_agg(distinct(au1.public_name), ', ') as participants
                from AppHistory ah1
                join AppUser au1 on ah1.spotify_uid = au1.spotify_uid
                where group_uid = ${group_uid}
                group by ah1.session_uid
        ) as SessionOverview
        join AppHistory ah2 on SessionOverview.session_uid = ah2.session_uid
        join AppUser au2 on ah2.spotify_uid = au2.spotify_uid
        left join AppGroup ag on ah2.group_uid = ag.group_uid
    `);
}

export async function getSessionPlaylist(group_uid: number){
    console.log("dbHelper: getGroupPlaylists");
    return await db.raw(`
        select date_created as date_start, spotify_playlist_uri, session_uid
        from appsession
        where group_uid = ${group_uid} and spotify_playlist_uri is not null
    `);
}