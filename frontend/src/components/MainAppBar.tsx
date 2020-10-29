import React, { useState } from 'react';
import userStore from '../store/user'
import { Button, AppBar, Toolbar, IconButton, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { RouteComponentProps, Redirect, withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

interface Props extends RouteComponentProps {}


const MainAppBar: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const userState = userStore()
    const [title, setTitle] = useState('metitle')
    return (
        <div className={classes.root}>
            <AppBar color='secondary' position="static">
                <Toolbar>
                    <IconButton edge="start" color="inherit" aria-label="menu">
                    <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                    {title}
                    </Typography>
                    <Button color="primary" variant='contained' onClick={() => {
                        userState.logout(() => {
                                console.log('login btn pressed')
                                history.push('/')
                            })
                        }}>
                        Logout
                    </Button>
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

export default withRouter(MainAppBar)