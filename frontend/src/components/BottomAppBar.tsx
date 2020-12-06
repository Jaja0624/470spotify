import React from 'react';
import { AppBar, Toolbar } from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import SpotifyPlayerContainer from './SpotifyPlayerContainer'

interface Props extends RouteComponentProps {}

const BottomAppBar: React.FC<Props> = ({history}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar color='secondary' position='fixed' className={classes.appBar}>
                <Toolbar className={classes.toolbar}>
                    <SpotifyPlayerContainer/>
                </Toolbar>
            </AppBar>
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
        toolbar: {
          alignItems: 'flex-start',
          paddingTop: theme.spacing(1),
          paddingBottom: theme.spacing(2),
          justifyContent: 'center'
        },
    }),
);

export default withRouter(BottomAppBar) // withRouter enables us to use the router even though this component is not a "Route"