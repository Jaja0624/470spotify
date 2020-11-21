import React, {useEffect} from 'react';
import userStore from '../store/user'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import MainAppBar from '../components/MainAppBar'
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import GroupDrawer from '../components/GroupDrawer/GroupDrawer'
import GroupDrawerSmall from '../components/GroupDrawer/Small/GroupDrawerSmall'
import shallow from 'zustand/shallow'
import globalStore from '../store/global'
import MiddleContainer from '../components/MiddleContainer';
import MemberList from '../components/MemberList'

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
    
    // when frontend loads, it will call the "all group" endpoint every 5s
    useEffect(() => {
        async function scopedGetGroup() {
            await user.getAndUpdateUserGroups();
        }
        if (user.validateAuthenticated()) {
            scopedGetGroup();
        }
        
        const source = new EventSource(REACT_APP_BACKEND + '/stream?spotifyid=' + user.spotifyProfile.id);
        source.onmessage = e => {
            console.log(JSON.parse(e.data));
        }
        source.addEventListener('updateGroup', async (ev: any) => {
            console.log('updateGroup');
            console.log(JSON.parse(ev.data));
            await user.getAndUpdateUserGroups()
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
                    <Grid item xs={7} className={`${classes.box} ${classes.bigBox}`}>
                        <MiddleContainer/>
                    </Grid>
                    <Grid item xs={3} className={`${classes.box} ${classes.smallBox}`}>
                            {globalState.middleContainer !== 'group'
                            ? (
                                <div>
                                    <TextField id="songSearch" label="Outlined" variant="outlined" />
                                    <div>SongName</div>
                                </div>
                            ) : (
                                <MemberList/>
                            )}
                    </Grid>
                </Grid>
            ) : (
                <Grid direction='row' container className={classes.container}>
                    <Grid>
                        <GroupDrawerSmall/>
                    </Grid>
                    <Grid direction='row' className={classes.smallContainer}>
                        <Grid item xs={9} className={`${classes.box} ${classes.smallBox}`}>
                            <MiddleContainer/>
                        </Grid>
                        <Grid item xs={3} className={`${classes.box} ${classes.smallBox}`}>
                            {globalState.middleContainer !== 'group'
                            ? (
                                <div>
                                    <TextField id="songSearch" label="Outlined" variant="outlined" />
                                    <div>SongName</div>
                                </div>
                            ) : (
                                <MemberList/>
                            )}
                        </Grid>
                    </Grid>
                    
                </Grid>
                
            )}
                
            
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        minHeight: '100vh',
        overflowY: 'hidden' // PREVENT SCROLLING
    },
    smallContainer: {
        flexGrow:1,
        height:'100%',
    },
    container: {
        flexGrow: 1,
        height:'100vh',
        paddingTop: 63,
    },
    box: {
        border: "solid 1px black",
        overflowY: 'auto'
    },
    drawer:{
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
  }),
);

export default withRouter(Dashboard) // withRouter enables us to use the router even though this component is not a "Route"