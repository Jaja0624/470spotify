import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Box, Button } from '@material-ui/core';
import SessionDetails from '../components/SessionDetails'
import CircularProgress from '@material-ui/core/CircularProgress';
import TrackTable from '../components/TrackTable'
import MiddleContainerHeader from '../components/MiddleContainerHeader'
import { socket } from '../core/socket'
import { joinChatData } from '../types/socket'

interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const SessionContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const [loading, setLoading] = useState(false);

    // executed when component is mounted
    const getSession = async (): Promise<any> => {
        return await userState.getActiveSession()

    }

    const joinSessionHandler = async () => {
        let clientData: joinChatData = {
            group_uid: userState.currentGroup?.id!,
            spotify_uid: userState.spotifyProfile.id,
            name: userState.spotifyProfile.display_name
        }
        socket.emit('joinSession', clientData)
    }

    const leaveSessionHandler = async () => {
        let clientData: joinChatData = {
            group_uid: userState.currentGroup?.id!,
            spotify_uid: userState.spotifyProfile.id,
            name: userState.spotifyProfile.display_name
        }
        socket.emit('leaveSession', clientData)
    }

    useEffect(() => {
        async function load() {
            const res = await getSession();
            setLoading(false);
        }
        setLoading(true);
        load();

    }, []) 

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
                        <Button variant='contained' color='primary' size='large' onClick={joinSessionHandler}>
                            Join Session
                        </Button>
                        <Button variant='text' style={{color:'red'}} size='large' onClick={leaveSessionHandler}>
                            Leave Session
                        </Button>
                    </Box>}
                    <TrackTable tracks={userState.currentSessionData.playlist?.tracks?.items}/>
                </Box>
            )}
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