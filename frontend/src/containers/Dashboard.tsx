import * as React from 'react';
import userStore from '../store/user'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import MainAppBar from '../components/MainAppBar'
import Grid from '@material-ui/core/Grid';
import { colors } from '@material-ui/core';
import theme from '../core/theme';
import { red } from '@material-ui/core/colors';
// import { Palette } from '@material-ui/icons';
import Container from '@material-ui/core/Container';
import TextField from '@material-ui/core/TextField';

interface Props extends RouteComponentProps {}

const Dashboard: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const userState = userStore()
    return (
        <div className={classes.root}>
            <MainAppBar/>
            <Grid direction='row' container className={classes.container}>
                <Grid item xs={8} className={`${classes.item} ${classes.bigBox}`}>
                    Start a new session with a new group
                </Grid>
                <Grid item xs={3} className={`${classes.item} ${classes.smallBox}`}>
                    <TextField id="songSearch" label="Outlined" variant="outlined" />
                    Song Name
                </Grid>
            </Grid>
            
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        minHeight: '100vh'
    },
    container: {
        height:'100vh',
        paddingTop: 80,
        flexGrow: 1,
    },
    item: {
        margin: 15,
        border: "solid 1px black"
    },
    bigBox: {
        textAlign: 'center',
    },
    smallBox: {
    }

  }),
);

export default withRouter(Dashboard) // withRouter enables us to use the router even though this component is not a "Route"