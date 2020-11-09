import React, { useState } from 'react';
import userStore from '../store/user'
import { AppBar, Toolbar, IconButton, Typography, Menu, MenuItem} from '@material-ui/core';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';

interface Props extends RouteComponentProps {}


const MainAppBar: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const userState = userStore()

    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [title, setTitle] = useState('metitle')
    const [open, setOpen] = React.useState(false);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const handleClose = (event: React.MouseEvent<EventTarget>) => {
        if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
        return;
        }

        setOpen(false);
    };

    function handleListKeyDown(event: React.KeyboardEvent) {
        if (event.key === 'Tab') {
        event.preventDefault();
        setOpen(false);
        }
    }

    const prevOpen = React.useRef(open);

    React.useEffect(() => {
        if (prevOpen.current === true && open === false) {
        anchorRef.current!.focus();
        }

        prevOpen.current = open;
    }, [open]);

    return (
        <div className={classes.root}>
            <AppBar color='secondary' position="fixed">
                <Toolbar>
                <Typography variant="h6" style={{flexGrow:1}}>
                    470
                </Typography>
                    <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                    {({ TransitionProps, placement }) => (
                        <Grow
                        {...TransitionProps}
                        style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                        >
                        <Paper>
                            <ClickAwayListener onClickAway={handleClose}>
                            <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                                <MenuItem onClick={() => {
                                    userState.logout(() => {
                                            console.log('login btn pressed')
                                            userState.setSpotifyProfile(undefined);
                                            history.push('/')
                                        })
                                    }}>
                                        Logout
                                </MenuItem>
                            </MenuList>
                            </ClickAwayListener>
                        </Paper>
                        </Grow>
                    )}
                    </Popper>

                    <IconButton ref={anchorRef}
                        aria-controls={open ? 'menu-list-grow' : undefined}
                        aria-haspopup="true"
                        onClick={handleToggle}>
                        <AccountCircleRoundedIcon className={classes.accountIcon}/>
                        <Typography variant="h6" className={classes.title}>
                            {userState.spotifyProfile?.display_name ? userState.spotifyProfile?.display_name : 'Hey There'}
                        </Typography>
                    </IconButton>
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
        title: {
            paddingLeft:5,
            flexGrow:1
        },
        logoutButton: {
            color: theme.palette.primary.main
        },
        accountIcon: {
            fontSize: 36
        }
    }),
);

export default withRouter(MainAppBar) // withRouter enables us to use the router even though this component is not a "Route"