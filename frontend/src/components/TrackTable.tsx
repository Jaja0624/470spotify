import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Button, IconButton, TableContainer, Table, 
    TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import globalStore from '../store/global'
import {extractUris, copyFrom} from '../core/utils'

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    tracks:any
}

// FC (function component)
const TrackList: React.FC<CustomPropsLol> = ({history, tracks}: CustomPropsLol) => {
    const globalState = globalStore();
    const classes = useStyles();
    console.log('playlist tracks', tracks);

    const extractTrackUris = (): string[] => {
        return extractUris(tracks);
    }
    const playButtonHandler = (trackUri: string) => {
        const index = tracks.findIndex((track: any) => track.track.uri === trackUri)
        globalState.setPlayerOffset(index)
        if (globalState.playing != true) {
            globalState.setPlaying(true);
        }
    }

    useEffect(() => {
        const trackUris = extractTrackUris();
        if (trackUris.length == 0) return;
        console.log('set tracks', trackUris);
        globalState.setTracksToPlay(trackUris);
    }, [])
    
    return (
        <div className={classes.root}>
            {!tracks ? (
                <div>Empty</div>
            ) : (
                <TableContainer>
                    <Table size='small' aria-label='a dense table'>
                        <TableHead>
                            <TableRow>
                                <TableCell></TableCell>
                                <TableCell>Title</TableCell>
                                <TableCell>Artist</TableCell>
                                <TableCell>Album</TableCell>
                                <TableCell>Added by</TableCell>
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
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
           
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