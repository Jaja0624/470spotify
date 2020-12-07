import React, { useState, useEffect } from 'react';
import userStore from '../store/user'
import { AppBar, Toolbar, Grid, IconButton, Avatar, Typography, Button, MenuItem, Box} from '@material-ui/core';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Grow from '@material-ui/core/Grow';
import Paper from '@material-ui/core/Paper';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import globalStore from '../store/global'

interface Props extends RouteComponentProps {}

const AdminMainAppBar: React.FC<Props> = ({history}) => {

    const classes = useStyles();
    const userState = userStore()
    const globalState = globalStore();
    const anchorRef = React.useRef<HTMLButtonElement>(null);
    const [open, setOpen] = React.useState(false);

    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
    };

    const logoutHandler = () => {
        history.push('/')
    }

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
                <Grid style={{flexGrow:1}} container direction='row'>
                    <Box width={1} display="flex" alignItems='center'>
                        <Box position='absolute' >
                            Flamingo Player
                            <Button color={globalState.middleContainer == "user" ? 'primary' : 'default'} onClick={() => {
                                globalState.setMiddleContainer('user')
                            }}>Home</Button>
                        </Box>

                        <Box width={1} display='flex' alignItems="center" justifyContent="center">
                            <Box width='50%'>
                            </Box>
                        </Box>
                    </Box>
                </Grid>
                
                <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
                {({ TransitionProps, placement }) => (
                    <Grow
                    {...TransitionProps}
                    style={{ transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom' }}
                    >
                    <Paper>
                        <ClickAwayListener onClickAway={handleClose}>
                        <MenuList autoFocusItem={open} id="menu-list-grow" onKeyDown={handleListKeyDown}>
                            <MenuItem onClick={logoutHandler}>
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
                        Admin
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

export default withRouter(AdminMainAppBar) // withRouter enables us to use the router even though this component is not a "Route"