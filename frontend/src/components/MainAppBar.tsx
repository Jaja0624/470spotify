import React from 'react';
import userStore from '../store/user';
import globalStore from '../store/global';
import { AppBar, Toolbar, IconButton, Avatar, Typography, Button, MenuItem, Menu, InputBase } from '@material-ui/core';
import { fade, makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import MenuIcon from '@material-ui/icons/Menu';
import SearchIcon from '@material-ui/icons/Search';
import MoreIcon from '@material-ui/icons/MoreVert';
import { getSearchResults } from '../core/spotify';
import Cookies from 'js-cookie';
import { socket } from '../core/socket'

interface Props extends RouteComponentProps {}

const MainAppBar: React.FC<Props> = ({history}) => {
    const userState = userStore();
    const globalState = globalStore();

    const classes = useStyles();
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);

    const isMenuOpen = Boolean(anchorEl);
    const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

    const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMobileMenuClose = () => {
        setMobileMoreAnchorEl(null);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        handleMobileMenuClose();
    };

    const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setMobileMoreAnchorEl(event.currentTarget);
    };

    const handleSpotifySearch = async () => {
        const accessToken = Cookies.get('spotifytoken');
        if (accessToken && userState.searchQuery)
        {
            const searchResults = await getSearchResults(accessToken, userState.searchQuery);
            globalState.setSearchResults(searchResults.data.tracks.items);
            globalState.setMiddleContainer('search');
        }
    };

    const logoutHandler = () => {
        console.log('logout btn pressed')
        userState.setSpotifyProfile(undefined);
        Cookies.remove('spotifytoken');
        socket.emit('loggedOut')
    }

    const menuId = 'primary-search-account-menu';
    const renderMenu = (
        <Menu id={menuId}
              anchorEl={anchorEl}
              getContentAnchorEl={null}
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              keepMounted
              transformOrigin={{ vertical: 'top', horizontal: 'right' }}
              open={isMenuOpen}
              onClose={handleMenuClose}>
            <MenuItem onClick={logoutHandler}>Log out</MenuItem>
        </Menu>
    );

    const mobileMenuId = 'primary-search-account-menu-mobile';
    const renderMobileMenu = (
        <Menu id={mobileMenuId}
            anchorEl={mobileMoreAnchorEl}
            getContentAnchorEl={null}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
            keepMounted
            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
            open={isMobileMenuOpen}
            onClose={handleMobileMenuClose}>
            <MenuItem onClick={handleProfileMenuOpen}>
                <IconButton aria-label="account of current user"
                            aria-controls="primary-search-account-menu"
                            aria-haspopup="true"
                            color="inherit">
                {
                    userState.spotifyProfile?.images[0] ?
                    <Avatar src={userState.spotifyProfile.images[0].url}/> :
                    <AccountCircleRoundedIcon className={classes.accountIcon}/>
                }
                </IconButton>
                <Typography variant="h6" className={classes.title}>
                    {
                        userState.spotifyProfile?.display_name ?
                        userState.spotifyProfile?.display_name : 
                        'Hey There'
                    }
                </Typography>
            </MenuItem>
        </Menu>
    );

    return (
    <div className={classes.grow}>
        <AppBar color='secondary' position="static">
            <Toolbar>
                <Typography className={classes.title} variant="h6" noWrap>
                    470
                </Typography>

                <Button className={classes.title}
                        onClick={() => {
                            userState.setSearchQuery('')
                            globalState.setMiddleContainer('user')
                        }}>
                    Home
                </Button>

                <div className={classes.search}>
                    <InputBase placeholder="Search Spotify"
                               classes={{
                                   root: classes.inputRoot,
                                   input: classes.inputInput,
                               }}
                               inputProps={{ 'aria-label': 'search' }}
                               onChange={event=>{ userState.setSearchQuery(event.target.value) }}
                               onKeyPress={event=> {
                                   if (event.key=='Enter')
                                       handleSpotifySearch();
                               }}
                               value={userState.searchQuery}
                    />
                    <IconButton type="submit"
                                className={classes.iconButton}
                                aria-label="search"
                                onClick={handleSpotifySearch}>
                        <SearchIcon/>
                    </IconButton>
                </div>
                <div className={classes.grow} />
                    <div className={classes.sectionDesktop}>
                        <IconButton edge="end"
                                    aria-label="account of current user"
                                    aria-controls={menuId}
                                    aria-haspopup="true"
                                    onClick={handleProfileMenuOpen}
                                    color="inherit">
                        {
                            userState.spotifyProfile?.images[0] 
                            ? <Avatar src={userState.spotifyProfile.images[0].url}/>
                            : <AccountCircleRoundedIcon className={classes.accountIcon}/>
                        }
                        <Typography variant="h6" className={classes.title}>
                        {
                            userState.spotifyProfile?.display_name ?
                            userState.spotifyProfile?.display_name :
                            'Hey There'
                        }
                        </Typography>
                    </IconButton>
                </div>
                <div className={classes.sectionMobile}>
                    <IconButton aria-label="show more"
                                aria-controls={mobileMenuId}
                                aria-haspopup="true"
                                onClick={handleMobileMenuOpen}
                                color="inherit">
                        <MoreIcon />
                    </IconButton>
                </div>
            </Toolbar>
        </AppBar>
        {renderMobileMenu}
        {renderMenu}
    </div>
    );
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        grow: {
            flexGrow: 1,
        },
        menuButton: {
            marginRight: theme.spacing(2),
        },
        title: {
            display: 'none',
            [theme.breakpoints.up('sm')]: {
            display: 'block',
          },
        },
        search: {
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: fade(theme.palette.common.white, 0.15), '&:hover': {
                backgroundColor: fade(theme.palette.common.white, 0.25),
            },
            marginRight: theme.spacing(2),
            marginLeft: 0,
            width: '100%',
            [theme.breakpoints.up('sm')]: {
                marginLeft: theme.spacing(3),
                width: 'auto',
            },
        },
        searchIcon: {
            padding: theme.spacing(0, 2),
            height: '100%',
            position: 'absolute',
            pointerEvents: 'none',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        },
        inputRoot: {
            color: 'inherit',
        },
        inputInput: {
            padding: theme.spacing(1, 1, 1, 0),
            // vertical padding + font size from searchIcon
            paddingLeft: `calc(1em + ${theme.spacing(1)}px)`,
            transition: theme.transitions.create('width'),
            width: '100%',
            [theme.breakpoints.up('md')]: {
                width: '20ch',
            },
        },
        sectionDesktop: {
            display: 'none',
            [theme.breakpoints.up('md')]: {
                display: 'flex',
            },
        },
        sectionMobile: {
            display: 'flex',
            [theme.breakpoints.up('md')]: {
                display: 'none',
            },
        },
        iconButton: {
            padding: 10,
        },
        accountIcon: {
            fontSize: 36
        }
    }),
);

export default withRouter(MainAppBar) // withRouter enables us to use the router even though this component is not a "Route"