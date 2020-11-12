var db = require('./dbConnection');

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