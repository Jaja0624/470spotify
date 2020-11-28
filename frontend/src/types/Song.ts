// Defines the structure of a song. Used for the SongItem component.
// The structure is designed so that it can be used as an item when outside a group page
// or as an item inside of a session playlist.
export default interface Song {
    //Date and time that the song was added into a session queue. Used potentially
    //for search purposes.
    date_added: Date,

    //Name of the app user who added the song to the session queue. Used for
    //search purposes.
    app_user: string,

    //Name of the song. Used for search purposes.
    songname : string,

    //Song URI. Used when exporting so that the app user can export the song to
    //their own Spotify account.
    song_uri : string,

    //Name of the group in which the session was under. Primarily used when outside 
    //a group page. Used for search purposes.
    group_name: string
}