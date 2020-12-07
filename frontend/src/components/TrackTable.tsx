import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { IconButton, TableContainer, Table, 
    TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import globalStore from '../store/global'
import userStore from '../store/user'
import { extractUris, remove } from '../core/utils'
import { removeTracksFromPlaylist, getUserProfile } from '../core/spotify';
import Cookies from 'js-cookie';
import { socket } from '../core/socket'
import CustomSnackbar from '../components/CustomSnackbar'

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    tracks:any
}

// FC (function component)
const TrackList: React.FC<CustomPropsLol> = ({history, tracks}: CustomPropsLol) => {
    const globalState = globalStore();
    const userState = userStore();
    const classes = useStyles();
    
    console.log('playlist tracks', tracks);
    const [error, setError] = useState({state: false, msg: ''});
    const [success, setSuccess] = useState({state: false, msg: ''});
    const accessToken = Cookies.get('spotifytoken');
    
    async function removeTrackFromPlaylist(tracks: string) {
        try {
            await removeTracksFromPlaylist(accessToken as string, userState.currentSessionData?.playlist.id!, tracks);
            console.log("Removing song:", tracks, "from playlist", userState.currentSessionData.playlist.id);
            setSuccess({state: true, msg: 'Success! Song removed'})
            const data = {
                group_uid: userState.currentGroup?.id
            }
            socket.emit('playlistChange', data);
            console.log("socket emit - playlistChange (track removed)")

        } catch (err) {
            setError({state: true, msg: 'Failed to remove song.'})
        }
    }
    
    const extractTrackUris = (): string[] => {
        return extractUris(tracks);
    }

    const playButtonHandler = async (trackUri: string) => {
        const accessToken = Cookies.get('spotifytoken');
        if (accessToken) {
            console.log("access token found", accessToken);

            const index = tracks.findIndex((track: any) => track.track.uri === trackUri)
            console.log("index", index, "track", trackUri);

            socket.emit('trackTable', [userState.currentSessionData, index]);
        }
    }
    
    const removeTrack = (trackUri: string) => {
        removeTrackFromPlaylist(trackUri);
    }

    return (
        <div className={classes.root}>
            <TableContainer>
                <Table size='small' aria-label='a dense table'>
                    <TableHead>
                        <TableRow>
                            <TableCell></TableCell>
                            <TableCell>Title</TableCell>
                            <TableCell>Artist</TableCell>
                            <TableCell>Album</TableCell>
                            <TableCell>Added by</TableCell>
                            <TableCell></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {tracks.map((track: any) => (
                            <TableRow key={track.track.id} hover>
                                <TableCell style={{display:'flex'}}>
                                    <IconButton onClick={() => playButtonHandler(track.track.uri)}>
                                        <PlayCircleFilledIcon/>
                                    </IconButton>
                                </TableCell>
                                <TableCell component="th" scope="row">
                                    {track.track.name}
                                </TableCell>
                                <TableCell >{track.track.artists.map((artist: any) => artist.name).join(', ')}</TableCell>
                                <TableCell >{track.track.album.name}</TableCell>
                                <TableCell >{track.added_by.id}</TableCell>
                                <TableCell style={{display:'flex'}}>
                                    <IconButton onClick={() => removeTrack(track.track.uri)}>
                                        <DeleteForeverIcon fontSize='small'/>
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <CustomSnackbar open={error.state} text={error.msg} close={() => setError({state: false, msg: ''})} type='error'/>
            <CustomSnackbar open={success.state} text={success.msg} close={() => setSuccess({state: false, msg: ''})} type='success'/>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    }),
);

export default withRouter(TrackList) // withRouter enables us to use the router even though this component is not a "Route"