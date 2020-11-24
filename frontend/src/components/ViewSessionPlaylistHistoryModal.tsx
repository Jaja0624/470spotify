import React, { useEffect, useState } from 'react';
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions, Typography} from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';

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

//Structure of the props for this component
interface Props extends RouteComponentProps {
    isOpen: boolean,
    cancelHandler: () => void, // when user clicks cancel
    successHandler: () => void // save handler
    playlist: Playlist
}



//A modal to view the songs of a selected playlist, allowing the user to name a playlist if they choose to export the songs.
const ViewSessionPlaylistHistoryModal: React.FC<Props> = ({history, isOpen, cancelHandler, successHandler, playlist}: Props) => {
    //The name of the playlist that may be exported. By default, it is the playlist session_uid
    const [playlistName, setPlaylistName] = useState(`${playlist.session_uid}`);
    
    //Updates the playlist name to be the default when the isOpen prob has updated
    useEffect(() => {
        setPlaylistName(`${playlist.session_uid}`);
    }, [isOpen])

    //Exports a playlist, as well as doing other actions based on the success handler.
    const exportHandler = (songs: Array<Song>) => {
        console.log("<ViewSessionPlaylistHistoryModal>: export the songs", songs);
        //TODO: make implementation of exporting the playlist here using the songs and playlistName
        successHandler();
    };

    return (
        <Dialog open={isOpen} onClose={cancelHandler} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Export Playlist</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    value={playlistName}
                    onChange={(val) => setPlaylistName(val.target.value)}
                    margin="dense"
                    id="playlistName"
                    label="Playlist Name"
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <Typography>
                TODO: Song list items will go here
            </Typography>
            <DialogActions>
                <Button onClick={cancelHandler} color="primary" variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={() => exportHandler(playlist.songs)} color="primary" variant='contained'>
                    Export Playlist
                </Button>
            </DialogActions>
        </Dialog>

    )
}

// withRouter enables us to use the router even though this component is not a "Route"
export default withRouter(ViewSessionPlaylistHistoryModal);