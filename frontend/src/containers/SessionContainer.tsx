import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Box, Button } from '@material-ui/core';
import SessionDetails from '../components/SessionDetails'
import CircularProgress from '@material-ui/core/CircularProgress';
import TrackTable from '../components/TrackTable'
import MiddleContainerHeader from '../components/MiddleContainerHeader'
import { socket } from '../core/socket'
import { joinChatData } from '../types/socket'
import CustomSnackbar from '../components/CustomSnackbar'

interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const SessionContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const globalState = globalStore();
    const [error, setError] = useState({state: false, msg: ''})
    const [loading, setLoading] = useState(false);

    const joinSessionHandler = async () => {
        if (userState.currentSessionPlaying != -1) {
            // user already in session 
            setError({state: true, msg: 'Please leave your current session first'})
        } else {
            let clientData: joinChatData = {
                group_uid: userState.currentGroup?.id!,
                spotify_uid: userState.spotifyProfile.id,
                name: userState.spotifyProfile.display_name
            }
            socket.emit('joinSession', clientData)
            userState.setCurrentSessionPlaying(userState.currentSessionData?.session_uid!)
        }
    }

    const leaveSessionHandler = async () => {
        let clientData: joinChatData = {
            group_uid: userState.currentGroup?.id!,
            spotify_uid: userState.spotifyProfile.id,
            name: userState.spotifyProfile.display_name
        }
        socket.emit('leaveSession', clientData)
        userState.setCurrentSessionPlaying(-1);
    }

    const sessionButtons = () => {
        if (userState.currentSessionPlaying === userState.currentSessionData.session_uid) {
            // user is in this session
            return (
                <Button variant='text' style={{color:'red'}} size='large' onClick={leaveSessionHandler}>
                    Leave Session
                </Button>
            ) 
        } else {
            return (
                <Button variant='contained' color='primary' size='large' onClick={joinSessionHandler}>
                    Join Session
                </Button>
            )
        }
    }

    return (
        <div className={classes.root}>
            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
                <MiddleContainerHeader/>
            </div>
            {loading ? (
                <CircularProgress/>
            ) : (
                <Box>
                    <Box height={200}>
                        <Box style={{paddingLeft:10}}>
                            <SessionDetails/>
                        </Box>
                        
                    </Box>
                    {userState.currentSessionData.is_active && <Box>
                        {sessionButtons()}
                    </Box>}
                    {userState.currentSessionData.playlist && <TrackTable tracks={userState.currentSessionData.playlist?.tracks?.items}/>}
                </Box>
            )}
            <CustomSnackbar open={error.state} text={error.msg} close={() => setError({state: false, msg: ''})} type='error'/>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        details: {
            maxHeight: '80vh'
        },
    }),
);

export default withRouter(SessionContainer) // withRouter enables us to use the router even though this component is not a "Route"