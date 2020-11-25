import React, { useCallback, useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Box } from '@material-ui/core';
import SpotifyPlayer from 'react-spotify-web-playback';
import { CallbackState } from 'react-spotify-web-playback/lib/types';
import Cookies from 'js-cookie';
import Timer from 'react-compound-timer'

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const SpotifyPlayerContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    // const userState = userStore();
    const globalState = globalStore();
    const [play, setPlay] = useState(false)
    const [time, setTime] = useState(0)

    const handleCallback = useCallback(({ type, ...state }: CallbackState) => {
        console.group(`RSWP: ${type}`);
        console.log(state);
        console.groupEnd();
        globalState.resetPlayTimer();
        globalState.setPlaying(state.isPlaying);
        globalState.setCurrentTrack(state.track);
      }, []);


 
    useEffect(() => {
        console.log("spotify player re-render")
    }, [globalState.tracksToPlay])
    
    return (
            <Box id='hhhh' width={1}>
                <SpotifyPlayer
                    syncExternalDevice
                    persistDeviceSelection
                    showSaveIcon 
                    token={Cookies.get('spotifytoken') as string}
                    uris={globalState.tracksToPlay}
                    play={globalState.playing}
                    callback={handleCallback} // executes everytime something changes in player
                    />
            </Box>
    )}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            backgroundColor:'red'
        },
    }),
);

export default withRouter(SpotifyPlayerContainer) // withRouter enables us to use the router even though this component is not a "Route"