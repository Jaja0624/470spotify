import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import { Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Typography} from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import UserPlaylists from './UserPlaylists'

interface Props extends RouteComponentProps {
    isOpen: boolean,
    cancelHandler: () => void, // when user clicks cancel
    saveHandler: (createNewPlaylist: boolean) => void // save handler
}

// create group popup
const StartSessionModal: React.FC<Props> = ({history, isOpen, cancelHandler, saveHandler}: Props) => {
    const classes = useStyles();
    const [newPlaylistChecked, setNewPlaylistChecked] = useState(false);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPlaylistChecked(event.target.checked);
    };

    return (
        <Dialog open={isOpen} onClose={cancelHandler} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Start a new session</DialogTitle>
            <DialogContent>
                <Typography>Select From Playlist</Typography>
                <UserPlaylists selectable={true}/>
            </DialogContent>
            <DialogActions>
                <Typography>Create New Playlist</Typography>
                <Checkbox checked={newPlaylistChecked} onChange={handleChange}></Checkbox>
                <Button onClick={cancelHandler} color="primary" variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={() => saveHandler(newPlaylistChecked)} color="primary" variant='contained'>
                    Start
                </Button>
            </DialogActions>
        </Dialog>
    )
}

const useStyles = makeStyles({
    root: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center'
    },
    title: {
        flexGrow:1
    }
});

export default withRouter(StartSessionModal) // withRouter enables us to use the router even though this component is not a "Route"