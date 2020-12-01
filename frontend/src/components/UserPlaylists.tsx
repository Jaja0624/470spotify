import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { List } from '@material-ui/core';
import UserPlaylistListItem from './UserPlaylistListItem'

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    selectable?: boolean
}

// FC (function component)
const UserPlaylists: React.FC<CustomPropsLol> = ({history, selectable = false}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const [selectedPlaylist, setSelectedPlaylist] = useState<any>(undefined);

    const selectItemHandler = (ev:any, playlistData: any) => {
        setSelectedPlaylist(playlistData);
        userState.setCreateSessionInfo({playlistData})
    }

    return (
        <div className={classes.root}>
            <List>
                {userState.userPlaylists && userState.userPlaylists.map((playlist: any) => {
                    return (<UserPlaylistListItem key={playlist.id} playlistData={playlist} selectable={selectable} selected={selectedPlaylist?.id} selectHandler={selectItemHandler}/>)
                })}
            </List>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        '@global': {
            '*::-webkit-scrollbar': {
            width: '10px'
            },
            '*::-webkit-scrollbar-track': {
                '-webkit-box-shadow': 'inset 0 0 6px rgba(35, 39, 42, .7)',
                '-webkit-border-radius': '10px'
            },
            '*::-webkit-scrollbar-thumb': {
                '-webkit-border-radius': '10px',
                'border-radius': '10px',
                'background': 'rgba(44, 47, 51)' 
            }
        }
    }),
);

export default withRouter(UserPlaylists) // withRouter enables us to use the router even though this component is not a "Route"