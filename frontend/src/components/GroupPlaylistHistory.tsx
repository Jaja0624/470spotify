import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { List } from '@material-ui/core';

import GroupPlaylistHistoryItem from '../components/GroupPlaylistHistoryItem';
import ViewSessionPlaylistHistoryModal from './ViewSessionPlaylistHistoryModal';
import SessionPlaylist from '../types/SessionPlaylist';

//Structure of the props for this component
interface Props extends RouteComponentProps{
    tabState: number,
    index: number
}

//TODO: Temporary, remove when properly retrieving session playlist data.
const examplePlaylistArray : Array<SessionPlaylist> = [
    {
        session_uid: 1,
        start_date: new Date(),
        participants: ["samplePerson1", "samplePerson2"],
        songs: [
            {
                date_added: new Date(),
                app_user: "samplePerson1",
                songname : "song1",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            },
            {
                date_added: new Date(),
                app_user: "samplePerson2",
                songname : "song2",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            }
        ]
    },
    {
        session_uid: 2,
        start_date: new Date(),
        participants: ["samplePerson3", "samplePerson4"],
        songs: [
            {
                date_added: new Date(),
                app_user: "samplePerson3",
                songname : "song3",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            },
            {
                date_added: new Date(),
                app_user: "samplePerson4",
                songname : "song4",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            },
            {
                date_added: new Date(),
                app_user: "samplePerson4",
                songname : "song4",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            },
            {
                date_added: new Date(),
                app_user: "samplePerson4",
                songname : "song4",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            },
            {
                date_added: new Date(),
                app_user: "samplePerson4",
                songname : "song4",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            },
            {
                date_added: new Date(),
                app_user: "samplePerson4",
                songname : "song4",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            },
            {
                date_added: new Date(),
                app_user: "samplePerson4",
                songname : "song4",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            },
            {
                date_added: new Date(),
                app_user: "samplePerson4",
                songname : "song4",
                song_uri : "someSonguri",
                group_name: "somegroup1"
            }
        ]
    }
];

//Shows the history of a group as sessions, represented as a list of past sessions.
//When a list item is chosen, it opens up a modal that allows the user to view the
//songs and potentially export it.
const GroupPlaylistHistory: React.FC<Props> = ({tabState, index} : Props) => {
    //Determines what information to show on the playlist history.

    //Assumes the element of a playlist is structured as a Playlist. The playlist
    //is set by any changes from the server.
    //TODO: replace for real data, probably in user store
    const [sessionPlaylistHistory, setPlaylistHistory] = useState<Array<SessionPlaylist>>(examplePlaylistArray);

    //State for the modal that looks at the current playlist. The modal reads the
    //playlist, the GroupPlaylistHistoryItem sets the current playlist.
    const [currentPlaylist, setPlaylist] = useState<SessionPlaylist>(sessionPlaylistHistory[0]);

    //State of the visibility of the modal component.
    const [isModalVisible, setIsModalVisible] = useState(false);

    //Function used when the searchtextfield has changed.
    const searchTextFieldChanged = () => {
        console.log("<GroupPlaylistHistory>: text field value changed");
    };

    //Function used for the items to execute when clicked.
    const viewModal = (playlist : SessionPlaylist) => {
        console.log("<GroupPlaylistHistory>: playlist was changed", playlist);
        setPlaylist(playlist);
        setIsModalVisible(true);
    };

    return (
        <div hidden={tabState !== index} id={`simple-tabpanel-${index}`}>
            <TextField id="playlistSearch" label="Search Playlist" variant="outlined" onChange={searchTextFieldChanged}/>
            <List>
                {
                    sessionPlaylistHistory.map((playlistItem:any) => {
                        return(
                            <GroupPlaylistHistoryItem 
                                key={playlistItem.session_uid}
                                session_uid={playlistItem.session_uid} 
                                startDate={playlistItem.start_date} 
                                participants={playlistItem.participants} 
                                onClickHandler={() => viewModal(playlistItem)}
                            />
                        );
                    })
                }
            </List>
            <ViewSessionPlaylistHistoryModal 
                isOpen={isModalVisible} 
                cancelHandler={() => setIsModalVisible(false)} 
                successHandler={() => setIsModalVisible(false)} 
                playlist={currentPlaylist}
            />
        </div>
    );
};

export default withRouter(GroupPlaylistHistory);