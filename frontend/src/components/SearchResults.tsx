import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { ListItem, ListItemAvatar, ListItemIcon, Avatar, ListItemText } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Cookies from 'js-cookie';
import { addTrackToPlaylist } from '../core/spotify';
import { getActive } from '../core/server'
import userStore from '../store/user'
import globalStore from '../store/global';
import CustomSnackbar from '../components/CustomSnackbar'
import { socket } from '../core/socket'
import { getPlaylist } from '../core/spotify'
import { AxiosResponse } from 'axios';

interface CustomPropsLol extends RouteComponentProps {
    searchData: any
}

const SearchResults: React.FC<CustomPropsLol> = ({history, searchData}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const globalState = globalStore();
    const [error, setError] = useState({state: false, msg: ''});
    const [success, setSuccess] = useState({state: false, msg: ''});

    const getArtists = (artists: []) => {
        var arr : any = [];
        artists.forEach(element => {
            arr.push(element['name']);
        })
        return arr.join(', ');
    }

    const addSongToQueue = async () => {
        const accessToken = Cookies.get('spotifytoken');
        if (!userState.currentSessionData.playlist) {
            setError({state: true, msg: 'Open an active session to add a song'})
            return;
        }
        try {
            globalState.setMiddleContainer('user') // close search results
            await addTrackToPlaylist(accessToken as string, userState.currentSessionData.playlist.id, searchData?.uri)
            console.log("Adding song:", searchData.name, searchData?.uri, "to playlist", userState.currentSessionData.playlist.id);
            setSuccess({state: true, msg: 'Success! Song added'})

            const playlistData: AxiosResponse = await getPlaylist(accessToken!, userState.currentSessionData.playlist.id)
            
            let newArr = [];
            for (let i = 0; i < playlistData.data.tracks.items.length; i++) {    
                    newArr.push(playlistData.data.tracks.items[i].track.uri)
            }
            
            globalState.tracksToPlay = newArr
            globalState.setTracksToPlay(newArr)
            console.log("UPDATED ADDED PLAYULISTE@@#$>@!??", newArr)

            let trackData = {spotify_playlist_uri: userState.currentSessionData.playlist.uri}
            const data = {
                group_uid: userState.currentGroup?.id
            }
            socket.emit('playlistChange', data);
            globalState.setMiddleContainer('session')
            console.log("socket emit - playlistChange (track added)")
        } catch (err) {
            setError({state: true, msg: 'Failed to add song. Make sure to join a group?'})
        }
    }

    return (
        <div>
            <ListItem button className={classes.root} onClick={addSongToQueue}>
                <ListItemIcon>
                    <AddIcon/>
                </ListItemIcon>
                <ListItemAvatar>
                {
                    searchData?.album.images[0]?.url && <Avatar src={searchData.album.images[0].url}/>
                }
                </ListItemAvatar>
                <ListItemText
                    primary={searchData.name}
                    secondary={getArtists(searchData.artists)}
                />
            </ListItem>
            <CustomSnackbar open={error.state} text={error.msg} close={() => setError({state: false, msg: ''})} type='error'/>
            <CustomSnackbar open={success.state} text={success.msg} close={() => setSuccess({state: false, msg: ''})} type='success'/>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft:5,
            justifyContent:'center',
            alignItems:'center',
            width: '100%',
        },
        selectedModifier: {
            backgroundColor: theme.palette.primary.dark,
        },
        textModifier:{
            textDecoration:"underline"
        }
    }),
);

export default withRouter(SearchResults) // withRouter enables us to use the router even though this component is not a "Route"