import React, { useState } from 'react';
import userStore from '../store/user'
import { Button, AppBar, Toolbar, IconButton, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

interface Props extends RouteComponentProps {}


const LandingAppBar: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const userState = userStore()
    const [title, setTitle] = useState('<Project Name>')
    return (
        <div className={classes.root}>
            <AppBar color='secondary' position="fixed">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                    {title}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    )
}

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
    title: {
        flexGrow:1
    }
});

export default withRouter(LandingAppBar) // withRouter enables us to use the router even though this component is not a "Route"