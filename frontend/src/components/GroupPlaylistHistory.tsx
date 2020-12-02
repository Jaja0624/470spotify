import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import TextField from '@material-ui/core/TextField';
import { List } from '@material-ui/core';

import GroupPlaylistHistoryItem from '../components/GroupPlaylistHistoryItem';
import ViewSessionPlaylistHistoryModal from './ViewSessionPlaylistHistoryModal';
import SessionPlaylist from '../types/SessionPlaylist';
import userStore from '../store/user';
import { getHistorySessionPlaylists } from '../core/server';

//Structure of the props for this component
interface Props extends RouteComponentProps{}


//Shows the history of a group as sessions, represented as a list of past sessions.
//When a list item is chosen, it opens up a modal that allows the user to view the
//songs and potentially export it.
const GroupPlaylistHistory: React.FC<Props> = () => {
    //Determines what information to show on the playlist history.
    const userState = userStore();

    //Assumes the element of a playlist is structured as a Playlist. The playlist
    //is set by any changes from the server.
    const [sessionPlaylistHistory, setPlaylistHistory] = useState<Array<SessionPlaylist>>([]);

    //State for the modal that looks at the current playlist. The modal reads the
    //playlist, the GroupPlaylistHistoryItem sets the current playlist.
    const [currentPlaylist, setPlaylist] = useState<SessionPlaylist | undefined>(undefined);

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

    async function pullPlaylists() {
        if (userState?.currentGroup?.id) {
            console.log("<GroupPlaylistHistory>: currentgroup = ", userState.currentGroup?.id);
            const backendPlaylists = await getHistorySessionPlaylists(parseInt(userState.currentGroup?.id));
            console.log("<GroupPlaylistHistory>: New history session playlist data taken from the backend: ", backendPlaylists);
            if (backendPlaylists.status === 200) {
                setPlaylistHistory(backendPlaylists.data);
            } else {
                console.log("error getting playlist", backendPlaylists);
            }
        } else {
            console.log(`<GroupPlaylistHistory>: The current group might be null: ${userState?.currentGroup?.id}`);
        }
    }

    useEffect(() => {
        console.log(`<GroupPlaylistHistory>: The current group has changed to id: ${userState.currentGroup?.id}. Updating...`);
        async function scopedPull() {
            await pullPlaylists();
        }
        scopedPull();
    }, [userState.currentGroup])

    return (
        <div>
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