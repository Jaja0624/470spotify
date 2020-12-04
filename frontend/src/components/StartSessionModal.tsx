import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Typography, FormControl, FormControlLabel, Radio, RadioGroup, TextField} from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import UserPlaylists from './UserPlaylists'
import CustomSnackbar from './CustomSnackbar'

interface Props extends RouteComponentProps {
    isOpen: boolean,
    cancelHandler: () => void, // when user clicks cancel
    saveHandler: (createNewPlaylist: boolean, isPublic: boolean, description: string) => void // save handler
}

// create group popup
const StartSessionModal: React.FC<Props> = ({history, isOpen, cancelHandler, saveHandler}: Props) => {
    const classes = useStyles();
    const [newPlaylistChecked, setNewPlaylistChecked] = useState(false);
    const [loading, setLoading] = useState(false);
    const [isPublic, setIsPublic] = useState(true);
    const [sessionDescription, setSessionDescription] = useState("");

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewPlaylistChecked(event.target.checked);
    };
    
    const handleRadioChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.value === 'public') {
            setIsPublic(true)
        } else {
            setIsPublic(false);
        }
    }
    return (
        <Dialog open={isOpen} onClose={cancelHandler} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Start a new session</DialogTitle>
            <DialogContent>
                <TextField
                            value={sessionDescription}
                            onChange={(val) => setSessionDescription(val.target.value)}
                            margin="dense"
                            id="sessionDescription"
                            label="Description"
                            type="text"
                            fullWidth
                        />
                <Typography>Select From Playlist</Typography>
                <UserPlaylists selectable={true}/>
            </DialogContent>
            <DialogContent style={{paddingTop: 15, paddingBottom: 15}}>
                <FormControl>
                    <RadioGroup defaultValue='public' 
                                aria-label='public' 
                                onChange={handleRadioChange}
                                style={{flexDirection:'row'}}>
                        <FormControlLabel value='public' control={<Radio/>} label='Public'/>
                        <FormControlLabel value='private' control={<Radio/>} label='Private'/>
                    </RadioGroup>
                </FormControl>
            </DialogContent>
            <DialogActions>
                <Typography>Create New Playlist</Typography>
                <Checkbox checked={newPlaylistChecked} onChange={handleChange}></Checkbox>
                <Button onClick={cancelHandler} color="primary" variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={() => saveHandler(newPlaylistChecked, isPublic, sessionDescription)} color="primary" variant='contained'>
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