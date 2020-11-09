import React, {useEffect} from 'react';
import userStore from '../store/user'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import MainAppBar from '../components/MainAppBar'
import Grid from '@material-ui/core/Grid';
import { Button, Typography } from '@material-ui/core';
import theme from '../core/theme';
import { red } from '@material-ui/core/colors';
// import { Palette } from '@material-ui/icons';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';
import GroupDrawer from '../components/GroupDrawer/GroupDrawer'
import GroupDrawerSmall from '../components/GroupDrawer/Small/GroupDrawerSmall'
import shallow from 'zustand/shallow'
import globalStore from '../store/global'
import CurrentPlaylist from '../components/CurrentPlaylist'

interface Props extends RouteComponentProps {}

const Dashboard: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const user = userStore()
    const {
        isGroupDrawerOpen, 
        hideGroupDrawer, 
        openGroupDrawer
    } = globalStore(state => ({ 
        isGroupDrawerOpen: state.isGroupDrawerOpen, 
        hideGroupDrawer: state.hideGroupDrawer,
        openGroupDrawer: state.openGroupDrawer,
    }), shallow);
    
    return (
        <div className={classes.root}>
            <MainAppBar/>
            {isGroupDrawerOpen ? (
                <Grid container className={classes.container}>
                    <Grid item xs={2}>
                        <GroupDrawer/>
                    </Grid>
                    <Grid item xs={7} className={`${classes.box} ${classes.bigBox}`}>
                        <CurrentPlaylist/>
                    </Grid>
                    <Grid item xs={3} className={`${classes.box} ${classes.smallBox}`}>
                        <TextField id="songSearch" label="Outlined" variant="outlined" />
                        <div>SongName</div>
                    </Grid>
                </Grid>
            ) : (
                <Grid direction='row' container className={classes.container}>
                    <Grid>
                        <GroupDrawerSmall/>
                    </Grid>
                    <Grid direction='row' className={classes.smallContainer}>
                        <Grid item xs={9} className={`${classes.box} ${classes.smallBox}`}>
                            <CurrentPlaylist/>
                        </Grid>
                        <Grid item xs={3} className={`${classes.box} ${classes.smallBox}`}>
                            <TextField id="songSearch" label="Outlined" variant="outlined" />
                            <div>SongName</div>
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
        minHeight: '100vh'
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