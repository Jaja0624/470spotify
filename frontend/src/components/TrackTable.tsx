import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, List, ListItem, IconButton, TableContainer, Table, 
    TableHead, TableRow, TableCell, TableBody} from '@material-ui/core';
import PlayCircleFilledIcon from '@material-ui/icons/PlayCircleFilled';
import PauseCircleFilled from '@material-ui/icons/PauseCircleFilled';


// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    tracks:any
}

// FC (function component)
const TrackList: React.FC<CustomPropsLol> = ({history, tracks}: CustomPropsLol) => {
    const classes = useStyles();
    console.log(tracks);
    const [toggleButton, setToggleButton] = useState(true);
    const [URIs, setURIs] = useState<string[]>(['spotify:album:51QBkcL7S3KYdXSSA0zM9R']);

    const playButtonHandler = () => {
        setToggleButton(!toggleButton)
        return toggleButton ? <PlayCircleFilledIcon/> : <PauseCircleFilled/>
    }
    
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
                                    <TableCell>
                                        <IconButton onClick={() => setToggleButton(!toggleButton)}>
                                            {toggleButton ? <PlayCircleFilledIcon/> : <PauseCircleFilled/>}
                                        </IconButton>
                                    </TableCell>
                                    <TableCell component="th" scope="row">
                                        {track.track.name}
                                    </TableCell>
                                    <TableCell align="right">{track.track.artists.map((artist: any) => artist.name).join(', ')}</TableCell>
                                    <TableCell align="right">{track.track.album.name}</TableCell>
                                    <TableCell align="right">{track.added_by.id}</TableCell>
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