import React, { useEffect, useState } from 'react';
// import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, Grid, Card, CardMedia, Box, Button, TableContainer, Table, TableHead, TableRow, TableBody, TableCell, Dialog} from '@material-ui/core';
import { ISessionData } from '../types/ISessionData'
import PeopleIcon from '@material-ui/icons/People';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';

interface Props extends RouteComponentProps {
    sessionData: ISessionData
}

// FC (function component)
const SessionItem: React.FC<Props> = ({history, sessionData}: Props) => {
    const classes = useStyles();
    const [inviteLink, setInviteLink] = useState(`/invite?groupid=${sessionData.group_uid}`)
    const [tracksModalVisible, setTracksModalVisible] = useState(false)
    // const userState = userStore();
    
    let imgProp = "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
    
    if (sessionData?.playlist?.images[0]?.url) {
        imgProp = sessionData.playlist.images[0].url
    }
    
    if (!sessionData || !sessionData.playlist) {
        return (
            <div className={classes.root}>
                Error
            </div>
        )
    }

    const joinGroup = () => {
        history.push(inviteLink);
    }

    const trackTable = (tracks: any) => {
        return (
            <Box padding="15px">
                <Button color='primary' variant='contained' onClick={joinGroup}>Join Group</Button>
                <TableContainer>
                    <Table size='small' aria-label='a dense table'>
                        <TableHead>
                            <TableRow>
                                <TableCell>Title</TableCell>
                                <TableCell>Artist</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {tracks.map((track: any) => (
                                <TableRow key={track.track.id} hover>
                                    <TableCell component="th" scope="row">
                                        {track.track.name}
                                    </TableCell>
                                    <TableCell >{track.track.artists.map((artist: any) => artist.name).join(', ')}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>
        )
    }


    return (
        <Box width="100%" height="100%" justifyContent='flex-start' >
            <Box onClick={() => setTracksModalVisible(true)} display="flex">
                <Box>
                    <CardMedia
                        className={classes.cover}
                        image={imgProp}/>
                </Box>
                <Box>
                    <Grid container direction='column' alignItems='flex-start' style={{paddingLeft:25}}>
                        <Box display="flex">
                            <Typography>{sessionData.group_name}</Typography>
                            {sessionData.usersCount ? (
                                <Typography style={{paddingLeft: 15}}><PeopleIcon/>{sessionData.usersCount}</Typography>
                            ) : (
                                <Typography style={{paddingLeft: 15}}><PeopleIcon/>0</Typography>
                            )}
                        </Box>
                        <Typography variant='h4' style={{fontWeight:'bold'}} >{sessionData.playlist.name}</Typography>
                        {sessionData.playlist?.description ? <Typography variant='h6' color='primary'>{sessionData.playlist.description}</Typography> : null}
                    </Grid>
                </Box>
            </Box>
            <Dialog onBackdropClick={() => setTracksModalVisible(false)} open={tracksModalVisible} onClose={() => setTracksModalVisible(false)} aria-labelledby="form-dialog-title">
                {trackTable(sessionData.playlist.tracks.items)}
            </Dialog>
        </Box>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        cover: {
            width:200,
            height:200
        }
    }),
);

export default withRouter(SessionItem) // withRouter enables us to use the router even though this component is not a "Route"