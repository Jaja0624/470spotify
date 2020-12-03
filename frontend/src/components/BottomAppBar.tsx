import React, { useState, useEffect } from 'react';
import userStore from '../store/user'
import { AppBar, Grid, Box, Toolbar} from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import globalStore from '../store/global'
import SpotifyPlayerContainer from './SpotifyPlayerContainer'

interface Props extends RouteComponentProps {}

const BottomAppBar: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const userState = userStore()
    const globalState = globalStore();
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [open, setOpen] = React.useState(false);
    const [timer, setTimer] = useState(0);

    const prevOpen = React.useRef(open);

    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);
      
    function millisToMinutesAndSeconds(millis: number) {
        var minutes = Math.floor(millis / 60000);
        var seconds: any = ((millis % 60000) / 1000).toFixed(0);
        return minutes + ":" + (seconds < 10 ? '0' : '') + seconds;
    }

    const secondsToMinutes = (seconds: number) => {
        return Math.floor(seconds / 60) + ':' + ('0' + Math.floor(seconds % 60)).slice(-2);
    }

    const updateTimer = (positionMs: number) => {
        setTimer((positionMs/1000.0)-1)
    }

    function duration() {
        if (globalState.currentTrack) {
            return millisToMinutesAndSeconds(globalState.currentTrack?.durationMs)
        } else {
            return "--"
        }
    }

    useEffect(() => {
        const interval = setInterval(() => {
            setTimer(timer => timer+1);
        }, 1000)
        return () => {
            clearInterval(interval);
        }
    }, [])
    return (
        <div className={classes.root}>
            <AppBar color='secondary' position='fixed' className={classes.appBar}>
                <Toolbar style={{padding: '0px'}}>
                    <Grid style={{flexGrow:1}} container direction='row'>
                        <Box width={1} display="flex" alignItems='center'>
                            {globalState.playing && <Box color='green' position='absolute' right={100} sizeHeight={10} zIndex='999999999999'>
                                    <div>{secondsToMinutes(timer)} / {duration()}</div>
                                </Box>}
                            <Box width={1} display='flex' alignItems="center" justifyContent="center">
                                <Box width='100%'>
                                    <SpotifyPlayerContainer seekPositionChangeHandler={updateTimer}/>
                                </Box>
                            </Box>
                        </Box>
                    </Grid>
                </Toolbar>
            </AppBar>
            <Toolbar />
        </div>
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
    }),
);

export default withRouter(BottomAppBar) // withRouter enables us to use the router even though this component is not a "Route"