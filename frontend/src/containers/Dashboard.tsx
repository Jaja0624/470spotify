import React, {useEffect} from 'react';
import userStore from '../store/user'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import MainAppBar from '../components/MainAppBar'
import BottomAppBar from '../components/BottomAppBar'
import Grid from '@material-ui/core/Grid';
import GroupDrawer from '../components/GroupDrawer/GroupDrawer'
import GroupDrawerSmall from '../components/GroupDrawer/Small/GroupDrawerSmall'
import shallow from 'zustand/shallow'
import globalStore from '../store/global'
import MiddleContainer from './MiddleContainer';
import RightContainer from './RightContainer'
import { socket } from '../core/socket'

const REACT_APP_BACKEND = process.env.REACT_APP_BACKEND || '';

interface Props extends RouteComponentProps {}

const Dashboard: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const user = userStore()
    const globalState = globalStore();
    const {
        isGroupDrawerOpen, 
        hideGroupDrawer, 
        openGroupDrawer
    } = globalStore(state => ({ 
        isGroupDrawerOpen: state.isGroupDrawerOpen, 
        hideGroupDrawer: state.hideGroupDrawer,
        openGroupDrawer: state.openGroupDrawer,
    }), shallow);
    
    function isGroupOrSessionMode() {
        return globalState.middleContainer === 'group' || globalState.middleContainer == 'session'
    }
    // when frontend loads, it will call the "all group" endpoint every 5s
    useEffect(() => {
        async function scopedGetGroup() {
            await user.getAndUpdateUserGroups();
        }
        if (user.validateAuthenticated()) {
            scopedGetGroup();
        }
        
        if (user.spotifyProfile.images.length != 0) {
            socket.emit('loggedIn', {spotify_uid: user.spotifyProfile.id, pro_pic: user.spotifyProfile?.images[0]?.url})
        } else {
            socket.emit('loggedIn', {spotify_uid: user.spotifyProfile.id, pro_pic: ''})
        }

        socket.on('updateGroup', async () => {
            console.log("socket on - updateGroup")
            await user.getAndUpdateUserGroups();
        })

        socket.on('updateSessions', async () => {
            console.log("socket on - updateSessions")
            await user.getActiveSession();
        })

    }, [])

    return (
        <div className={classes.root}>
            <MainAppBar/>
            {isGroupDrawerOpen ? (
                <Grid container className={classes.container}>
                    <Grid item xs={2} className={classes.drawer}>
                        <GroupDrawer/>
                    </Grid>
                    <Grid item xs={!isGroupOrSessionMode() ? 10 : 7} className={`${classes.box} ${classes.bigBox}`}>
                        <MiddleContainer/>
                    </Grid>
                    {isGroupOrSessionMode() && (
                        <Grid item xs={3} className={`${classes.box} ${classes.smallBox}`}>
                                <RightContainer/>
                        </Grid>
                    )}
                </Grid>
            ) : (
                <Grid direction='row' container className={classes.container}>
                    <Grid>
                        <GroupDrawerSmall/>
                    </Grid>
                    <Grid item xs={!isGroupOrSessionMode() ? 12 : 9} className={`${classes.box} ${classes.bigBox}`}>
                        <MiddleContainer/>
                    </Grid>
                    {isGroupOrSessionMode() && (
                        <Grid item xs={3} className={`${classes.box} ${classes.smallBox}`}>
                                <RightContainer/>
                        </Grid>
                    )}
                </Grid>
            )}
            <BottomAppBar/>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        height: '100vh',
        overflowY: 'hidden' // PREVENT SCROLLING
    },
    smallContainer: {
        flexGrow:1,
        height:'100%',
    },
    container: {
        flexGrow: 1,
        height:'100%',
        paddingBottom: 171,
    },
    box: {
        border: "solid 1px black",
        overflowY: 'auto'
    },
    drawer:{
        height:'100%',
        overflowY:'auto',
        backgroundColor: theme.drawer.backgroundColor,

    },
    bigBox: {
        width: '100%',
        height: '100%',
        textAlign: 'left',
    },
    smallBox: {
        height: '100%',
        width: '100%',
        float:'left',
        textAlign:'left'
      },
    '@global': {
        '*::-webkit-scrollbar': {
        width: '10px'
        },
        '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(35, 39, 42, .7)',
            '-webkit-border-radius': '10px'
        },
        '*::-webkit-scrollbar-thumb': {
            '-webkit-border-radius': '10px',
            'border-radius': '10px',
            'background': 'rgba(44, 47, 51)' 
        }
    }
  }),
);

export default withRouter(Dashboard) // withRouter enables us to use the router even though this component is not a "Route"