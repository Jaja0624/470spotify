import React, { useCallback, useEffect, useState } from 'react';
import globalStore from '../store/global'
import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Box, useTheme } from '@material-ui/core';
import SpotifyPlayer from 'react-spotify-web-playback';
import { CallbackState } from 'react-spotify-web-playback/lib/types';
import Cookies from 'js-cookie';
import { socket } from '../core/socket'

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const SpotifyPlayerContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const globalState = globalStore();
    const [play, setPlay] = useState(false)
    const [time, setTime] = useState(0)
    const theme = useTheme();

    const handleCallback = useCallback(({ type, ...state }: CallbackState) => {
        console.group(`RSWP: ${type}`);
        console.log('tracksToPlay', globalState.getTracksToPlay())
        console.log(state);
        console.groupEnd();
        globalState.resetPlayTimer();
        globalState.setPlaying(state.isPlaying);
        globalState.setCurrentTrack(state.track);
        socket.emit('sessionMusicChange', state)
      }, []);

    useEffect(() => {
        socket.on('updatePlayer', (data: any) => {
            console.log("updatePlayer", data)
            if (data.isPlaying === false) {
                globalState.setPlaying(false);
                return;
            } else if (data.isPlaying === true) {
                const indexOfTrack = globalState.getTracksToPlay().findIndex((trackUri: string) => trackUri === data.track.uri)
                if (indexOfTrack > 0) {
                    globalState.setPlayerOffset(indexOfTrack);
                    globalState.setPlaying(true);
                    console.log("changed track")
                } 
            }

        })
    }, [])
    useEffect(() => {
        console.log("spotify player re-render")
    }, [globalState.tracksToPlay])
    
    return (
            <Box id='hhhh' width={1}>
                <SpotifyPlayer
                    offset={globalState.playerOffset}
                    syncExternalDevice
                    persistDeviceSelection
                    showSaveIcon
                    magnifySliderOnHover={true} 
                    token={Cookies.get('spotifytoken') as string}
                    uris={globalState.tracksToPlay}
                    play={globalState.playing}
                    callback={handleCallback} // executes everytime something changes in player
                    styles={{
                        bgColor: theme.palette.secondary.main,
                        color: '#ffffff',
                        loaderColor: '#ffffff',
                        sliderColor: theme.palette.primary.main,
                        savedColor: theme.palette.primary.main,
                        trackArtistColor: '#cccccc',
                        trackNameColor: '#ffffff',
                        sliderHandleColor: '#ffffff',
                        sliderTrackColor: theme.palette.secondary.light,
                      }}
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