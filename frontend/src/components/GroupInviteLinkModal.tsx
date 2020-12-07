import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import { Button, Grid, Dialog, DialogTitle, DialogContent, DialogActions, Typography} from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

interface Props extends RouteComponentProps {
    isOpen: boolean,
    cancelHandler: () => void, // when user clicks done
}


// create group popup
const GroupInviteLinkModal: React.FC<Props> = ({history, isOpen, cancelHandler}: Props) => {
    const classes = useStyles();
    const userState = userStore();
    const [inviteLink, setInviteLink] = useState('No Group Found');
    const REACT_APP_PROJECT_URL = process.env.REACT_APP_PROJECT_URL || 'http://localhost';
    
    useEffect(() => {
        if (userState?.currentGroup?.id) {
            console.log("asdasdasd", userState)
            setInviteLink(`${REACT_APP_PROJECT_URL}:3000/invite?groupid=${userState.currentGroup.id}`) 
        } 
    })
        
    return (
        <Dialog open={isOpen} onClose={cancelHandler} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Public Invite Link</DialogTitle>
            <DialogContent>
                <Grid container
                    direction='row'
                    alignItems='center'>
                    <Typography>{inviteLink}</Typography>
                        
                </Grid>
            </DialogContent>
            <DialogActions>
                <div style={{flexGrow: 1}}>
                    <Button color='secondary' variant='contained' onClick={() => {
                        navigator.clipboard.writeText(inviteLink)
                    }}>Copy Link</Button>
                </div>

                
                <Button onClick={cancelHandler} color="primary" variant='contained'>
                    Done
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

export default withRouter(GroupInviteLinkModal) // withRouter enables us to use the router even though this component is not a "Route"