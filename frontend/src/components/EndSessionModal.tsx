import React, { useEffect, useState } from 'react';
import { Button, Checkbox, Dialog, DialogTitle, DialogContent, DialogActions, Typography, FormControl, FormControlLabel, Radio, RadioGroup} from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import UserPlaylists from './UserPlaylists'
import CustomSnackbar from './CustomSnackbar'

interface Props extends RouteComponentProps {
    isOpen: boolean,
    cancelHandler: () => void, // when user clicks cancel
    saveHandler: (unfollow: boolean) => void // save handler
}

// create group popup
const StartSessionModal: React.FC<Props> = ({history, isOpen, cancelHandler, saveHandler}: Props) => {
    const classes = useStyles();
    const [unfollowChecked, setUnfollowChecked] = useState(true);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setUnfollowChecked(event.target.checked);
    };
    
    return (
        <Dialog open={isOpen} onClose={cancelHandler} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">End Session</DialogTitle>
            <DialogActions>
                <Typography>Delete playlist? </Typography>
                <Typography>(playlist will be removed from your list but still exist)</Typography>

                <Checkbox checked={unfollowChecked} onChange={handleChange}></Checkbox>
                <Button onClick={cancelHandler} color="primary" variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={() => saveHandler(unfollowChecked)} style={{color:'red'}} variant='contained'>
                    End Session
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