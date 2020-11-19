import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, List, ListItem } from '@material-ui/core';
import UserPlaylistListItem from './UserPlaylistListItem'
import { getPlaylists } from '../core/spotify'

interface IObj {
    name: string,
    derp: {},
    awag: string[],
}

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
}

// FC (function component)
const UserPlaylists: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();

    return (
        <div className={classes.root}>
            <Typography>
                Your Playlists
            </Typography>
            <List>
              {userState.userPlaylists && userState.userPlaylists.map((playlist: any) => {
                  return (<UserPlaylistListItem key={playlist.id} playlistData={playlist}/>)
              })}
            </List>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    }),
);

export default withRouter(UserPlaylists) // withRouter enables us to use the router even though this component is not a "Route"