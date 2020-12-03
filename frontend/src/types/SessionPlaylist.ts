import Song from './Song';

//Defines the structure of the session playlist. This is primarily used in the 
//Group Playlist history component for searching and exporting.
export default interface SessionPlaylist {
    //Key of a session when used in a List and a default name for the playlist 
    //naming when exporting.
    session_uid: number,

    //Date of when the session was made. Used as the main description of a
    //session playlist when used in a List component. Could be used for search
    //purposes.
    start_date: Date,
    
    //All participants of a session playlist. Used as secondary information of
    //a session playlist when used in a List component. Could be used for search
    //purposes.
    participants: String,

    //All songs of a session playlist. Used for the ViewSessionPlaylistHistoryModal
    //for potential exporting of the songs to the user's Spotify account. Could be
    //used for search purposes.
    songs: Array<Song>
}