import React, { useEffect, useState } from 'react';
import globalStore from '../store/global'
import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Grid, Typography, Slider, Box, useTheme } from '@material-ui/core';
import Cookies from 'js-cookie';
import { socket } from '../core/socket'

// icons
import PlayCircleOutlineIcon from '@material-ui/icons/PlayCircleOutline';
import PauseCircleOutlineIcon from '@material-ui/icons/PauseCircleOutline';
import IconButton from '@material-ui/core/IconButton';
import SkipPreviousIcon from '@material-ui/icons/SkipPrevious';
import SkipNextIcon from '@material-ui/icons/SkipNext';
import VolumeUpIcon from '@material-ui/icons/VolumeUp';

import { playSong, playPlaylist, pausePlayback, resumePlayback, skipForwardPlayback, skipPreviousPlayback, seekPlayback, changeVolume } from '../core/spotify';
declare const window: any;

interface Props extends RouteComponentProps { }

const SpotifyPlayerContainer: React.FC<Props> = ({ history }) => {
    const classes = useStyles();
    const userState = userStore();
    const globalState = globalStore();

    const [currentSong, setCurrentSong] = React.useState<any>(0);
    const [currentSpotifyState, setCurrentSpotifyState] = React.useState<any>(0);

    const [trackTime, setTrackTime] = React.useState<number>(0);
    const [trackEndTime, setTrackEndTime] = React.useState<string>('');
    const [currentTrackTime, setCurrentTrackTime] = React.useState<string>('');
    const [volume, setVolume] = React.useState<number | string | Array<number | string>>(30);

    const handleOnChangeTrackSliderChange = async (event: any, newValue: number | number[]) => {
        setTrackTime(newValue as number);
        setCurrentTrackTime(msToMMSS(newValue as number));
    };

    const handleTrackSliderChange = async (event: any, newValue: number | number[]) => {
        socket.emit('sessionMusicChange', ['seek', (newValue as number)]);
    };

    const handleVolumeSliderChange = async (event: any, newValue: number | number[]) => {
        setVolume(newValue);
        const accessToken = Cookies.get('spotifytoken');
        if (accessToken) {
            const res = await changeVolume(accessToken, userState.spotifyDeviceId, (newValue as number));
        }
    };

    const msToMMSS = (ms : number) => {
        var tmp = ms / 1000;
        var min = 0;
        var sec = 0;
        var str = '';

        min = Math.floor(tmp/60);
        sec = Math.floor(tmp % 60);

        str += min;
        str += ':';

        if (sec < 10)
        {
            str += '0';
        }
        str += sec;

        return str;
    }

    const secondsToString = (sec : number) => {
        var min = 0;
        var secs = 0;
        var str = '';

        min = Math.floor(sec/60);
        secs = Math.floor(sec % 60);

        str += min;
        str += ':';

        if (secs < 10)
        {
            str += '0';
        }
        str += secs;

        return str;
    }

    const getArtists = (artists: []) => {
        if (artists)
        {
            var arr : any = [];
            artists.forEach(element => {
                arr.push(element['name']);
            })
            return arr.join(', ');
        }
    }
    const handleSkipPrevious = async () => {
        socket.emit('sessionMusicChange', ['previous']);
    }
    const handlePlayPause = async () => {

        if (globalState.playing) {
            socket.emit('sessionMusicChange', ['paused']);
        }
        else {
            socket.emit('sessionMusicChange', ['play']);
        }
    }
    const handleSkipForward = async () => {
        socket.emit('sessionMusicChange', ['forward']);
    }

    useEffect(() => {

        socket.on('updatePlayer', async (data: any) => {
            console.log("updatePlayer data ", data);
            if (!(userState.spotifyDeviceId)) {
                return;
            }

            const accessToken = Cookies.get('spotifytoken');
            if (accessToken) {
                if (data[0] == 'previous') {
                    const res = await skipPreviousPlayback(accessToken, userState.spotifyDeviceId);
                    console.log("res", res);
                    globalState.setPlaying(true);
                }
                else if (data[0] == 'forward') {
                    const res = await skipForwardPlayback(accessToken, userState.spotifyDeviceId);
                    console.log("res", res);
                    globalState.setPlaying(true);
                }
                else if (data[0] == 'paused') {
                    const res = await pausePlayback(accessToken, userState.spotifyDeviceId);
                    console.log("res", res);
                    globalState.setPlaying(false);
                }
                else if (data[0] == 'play') {
                    const res = await resumePlayback(accessToken, userState.spotifyDeviceId);
                    console.log("res", res);
                    globalState.setPlaying(true);
                }
                else if (data[0] == 'seek') {
                    const res = await seekPlayback(accessToken, userState.spotifyDeviceId, data[1]*1000);
                    setTrackTime(data[1]);
                    setCurrentTrackTime(msToMMSS(data[1]));
                }
            }
        });

        socket.on('updateFromTrackTable', async (data: any) => {
            console.log("updateFromTrackTable data ", data);
            if (!(userState.spotifyDeviceId)) {
                return;
            }

            const accessToken = Cookies.get('spotifytoken');
            if (accessToken) {
                const res = await playPlaylist(accessToken, userState.spotifyDeviceId, data[0].playlist.uri, data[1]);
                console.log("res:", res);
                globalState.setCurrentTrack(data[0].playlist.tracks.items[data[1]].track);
                globalState.setPlaying(true);
            }
        });

    }, [userState.spotifyDeviceId])

    useEffect(() => {
        const token = Cookies.get('spotifytoken');

        if (token)
        {
            const player = new window.Spotify.Player({
                name: 'Flamingo Player',
                getOAuthToken: (cb : any) => { cb(token); }
            });

            // Error handling
            player.addListener('initialization_error', ({ message } : any) => { console.error(message); });
            player.addListener('authentication_error', ({ message } : any) => { console.error(message); });
            player.addListener('account_error', ({ message } : any) => { console.error(message); });
            player.addListener('playback_error', ({ message } : any) => { console.error(message); });

            // Playback status updates
            player.addListener('player_state_changed', (state : any) => { 
                setCurrentSong(state.track_window.current_track);
                setTrackTime((state.position/1000));
                setTrackEndTime(msToMMSS(state.duration));
                setCurrentSpotifyState(state);
                // if (state.paused === true) {
                //     console.log("MUSIC PAUSED");
                //     socket.emit('musicPaused', state);
                // }
                socket.emit('sessionMusicChange', state);
            });

            // Ready
            player.addListener('ready', ({ device_id } : any) => {
                console.log('Ready with Device ID', device_id);
                userState.setSpotifyDeviceId(device_id);
            });

            // Not Ready
            player.addListener('not_ready', ({ device_id } : any) => {
                console.log('Device ID has gone offline', device_id);
            });

            // Connect to the player!
            player.connect();
        }
    }, [userState.spotifyProfile])

    useEffect(() => {
        console.log("Current track has changed", globalState.currentTrack);
        setCurrentSong(globalState.currentTrack);
        setTrackEndTime(msToMMSS(globalState.currentTrack.duration_ms));

    }, [globalState.currentTrack])

    useEffect(() => {
        if (globalState.playing)
        {
            const interval = setInterval(() => {
                setTrackTime(trackTime => trackTime+1);
                setCurrentTrackTime(msToMMSS(trackTime));
            }, 1000)
            return () => {
                clearInterval(interval);
            }
        }
    }, [globalState.playing])

    return (
        <Grid container spacing={3} alignItems="center">
            <Grid item xs={1}>
            {
                currentSong?.album?.images[0]?.url && <img className={classes.img} src={currentSong?.album.images[0]?.url} />
            }
            </Grid>
                <Grid item xs>
                <Typography >
                  {currentSong?.name}
                  </Typography>
                  <Typography variant="subtitle1" color="textSecondary">
                  {getArtists(currentSong?.artists)}
                  </Typography>
                </Grid>
                <Grid item xs={6} className={classes.paper}>
                    <IconButton aria-label="previous" color="inherit" onClick={handleSkipPrevious}>
                        <SkipPreviousIcon/>
                    </IconButton>   
                    <IconButton aria-label="play" color="inherit" onClick={handlePlayPause}>
                    {
                        globalState.playing ? (<PauseCircleOutlineIcon/>):(<PlayCircleOutlineIcon/>)
                    }
                    </IconButton>
                    <IconButton aria-label="forward" color="inherit" onClick={handleSkipForward}>
                        <SkipNextIcon/>
                    </IconButton>

                    <Typography className={classes.title} variant="h5" noWrap>
                        <Grid item xs className={classes.songSlider}>
                            <Grid container spacing={3}>
                                <Grid item xs={2} className={classes.paper}>
                                    <Typography>
                                        {
                                            currentSong && (secondsToString(trackTime))
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item xs className={classes.paper}>
                                    <Slider
                                        value={typeof trackTime === 'number' ? trackTime : 0}
                                        onChange={handleOnChangeTrackSliderChange}
                                        onChangeCommitted={handleTrackSliderChange}
                                        aria-labelledby="input-slider"
                                        max={Math.floor(currentSong.duration_ms/1000)}
                                    />
                                    </Grid>
                                <Grid item xs={2} className={classes.paper}>
                                    <Typography>
                                        {
                                            currentSong && trackEndTime
                                        }
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Typography>
                </Grid>
                <Grid item xs className={classes.right}>
                    <Grid container spacing={5}>
                        <Grid item xs={1}>
                            <VolumeUpIcon/>
                        </Grid>
                        <Grid item xs>
                      <Slider
                          value={typeof volume === 'number' ? volume : 0}
                          onChange={handleVolumeSliderChange}
                          aria-labelledby="input-slider"
                      />
                      </Grid>
                      </Grid>
                </Grid>
              </Grid>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow: 1,
        },
        appBar: {
            flexGrow: 1,
            top: 'auto',
            bottom: 0,
        },
        toolbar: {
          alignItems: 'flex-start',
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(2),
          justifyContent: 'center'
        },
        songSlider: {
          flexGrow: 1,
          alignSelf: 'flex-end',
        },
        title: {
          flexGrow: 1,
          alignSelf: 'flex-end',
        },
        paper: {
          padding: theme.spacing(2),
          textAlign: 'center',
          color: theme.palette.text.secondary,
        },
        volumeSlider: {
            flexGrow: 1,
            alignSelf: 'flex-end',
        },
        right: {
            align:"center",
            justify:"center",
            textAlign: "center"
        },
        img: {
            width:'100%',
        }
    }),
);

export default withRouter(SpotifyPlayerContainer) // withRouter enables us to use the router even though this component is not a "Route"