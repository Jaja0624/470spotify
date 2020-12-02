import React, { useEffect, useState } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography, List} from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';

import SessionPlaylist from '../types/SessionPlaylist';
import Song from '../types/Song';
import SongListItem from './SongListItem';

//Structure of the props for this component
interface Props extends RouteComponentProps {
    isOpen: boolean,
    cancelHandler: () => void, // when user clicks cancel
    successHandler: () => void // additional actions when exporting the playlist
    playlist: SessionPlaylist | undefined // playlist potentially undefined if the group has never had a session .. this is okay since a modal will never be showed if there is no playlist to begin with
}



//A modal to view the songs of a selected playlist, allowing the user to name a playlist if they choose to export the songs.
const ViewSessionPlaylistHistoryModal: React.FC<Props> = ({history, isOpen, cancelHandler, successHandler, playlist}: Props) => {
    //The name of the playlist that may be exported. By default, it is the playlist session_uid
    const [playlistName, setPlaylistName] = useState(`${playlist?.session_uid}`);
    
    //Updates the playlist name to be the default when the isOpen prob has updated
    useEffect(() => {
        setPlaylistName(`${playlist?.session_uid}`);
    }, [isOpen])

    //Exports a playlist, as well as doing other actions based on the success handler.
    const exportHandler = (songs: Array<Song> | undefined) => {
        console.log("<ViewSessionPlaylistHistoryModal>: export the songs", songs);
        //TODO: make implementation of exporting the playlist here using the songs and playlistName
        successHandler();
    };

    //Gets the key  to a SongListItem
    const getSongKey = (song : Song) => {
        var curDate = new Date(song.date_added);
        return `${curDate.getTime()}${song.app_user}`;
    };

    return (
        <Dialog open={isOpen} onClose={cancelHandler} aria-labelledby="form-dialog-title" fullWidth={true} scroll="paper">
            <DialogTitle id="form-dialog-title">Export Playlist</DialogTitle>
            <DialogContent>
                <TextField
                    value={playlistName}
                    onChange={(val) => setPlaylistName(val.target.value)}
                    margin="dense"
                    id="playlistName"
                    label="Playlist Name"
                    type="text"
                    fullWidth
                />
                <List>
                    {
                        playlist?.songs.map((song)=>{
                            return <SongListItem 
                                key={getSongKey(song)}
                                song={song} 
                                isAppUserVisible={true} 
                                isGroupNameVisible={false} 
                                isDateAddedVisible={false} 
                                onClickHandler={() => {}}
                            />
                        })
                    }
                </List>
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelHandler} color="primary" variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={() => exportHandler(playlist?.songs)} color="primary" variant='contained'>
                    Export Playlist
                </Button>
            </DialogActions>
        </Dialog>

    )
}

// withRouter enables us to use the router even though this component is not a "Route"
export default withRouter(ViewSessionPlaylistHistoryModal);