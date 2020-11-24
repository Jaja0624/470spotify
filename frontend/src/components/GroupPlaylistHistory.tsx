import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { List } from '@material-ui/core';
import GroupPlaylistHistoryItem from '../components/GroupPlaylistHistoryItem';

interface Props extends RouteComponentProps{
    //no props to send   
}

// Defines the structure of a song. This is used for the modal which exports the playlist.
interface Song {
    songname : string,
    song_uri : string
}

//Defines the structure of the playlistHistory state. This is used for each list item.
interface Playlist {
    session_uid: number,
    start_date: Date,
    participants: Array<String>,
    songs: Array<Song>
}

const GroupPlaylistHistory: React.FC<Props> = () => {
    //Determines what information to show on the playlist history.

    //Assumes the element of a playlist is structured as a Playlist. The playlist
    //is set by any changes from the server.
    const [playlistHistory, setPlaylistHistory] = useState<Array<Playlist>>([
        {
            session_uid: 1,
            start_date: new Date(),
            participants: ["samplePerson1", "samplePerson2"],
            songs: [
                {
                    songname : "song1",
                    song_uri : "someSonguri"
                },
                {
                    songname : "song2",
                    song_uri : "someSonguri"
                }
            ]
        },
        {
            session_uid: 2,
            start_date: new Date(),
            participants: ["samplePerson3", "samplePerson4"],
            songs: [
                {
                    songname : "song3",
                    song_uri : "someSonguri"
                },
                {
                    songname : "song4",
                    song_uri : "someSonguri"
                }
            ]
        }
    ]);

    //State for the modal that looks at the current playlist. The modal reads the
    //playlist, the GroupPlaylistHistoryItem sets the current playlist.
    const [currentPlaylist, setPlaylist] = useState<Playlist>();

    //Function used when the searchtextfield has changed.
    const searchTextFieldChanged = () => {
        console.log("<GroupPlaylistHistory>: text field value changed");
    };

    //Function used for the items to execute when clicked.
    const changePlaylist = (playlist : Playlist) => {
        console.log("playlist was changed");
        console.log(playlist);
        setPlaylist(playlist);
    };

    return (
        <div>
            <TextField id="playlistSearch" label="Search Playlist" variant="outlined" onChange={searchTextFieldChanged}/>
            <List>
                {
                    playlistHistory.map((playlistItem:any) => {
                        return(
                            <GroupPlaylistHistoryItem key={playlistItem.session_uid} startDate={playlistItem.start_date} participants={playlistItem.participants} onClickHandler={() => changePlaylist(playlistItem)}/>
                        );
                    })
                }
            </List>
        </div>
    );
};

export default withRouter(GroupPlaylistHistory);