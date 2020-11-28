import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, Grid, Card, CardMedia, Box} from '@material-ui/core';

interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const SessionDetails: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    
    let imgProp = "https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"
    

    if (userState?.currentSessionData?.playlist?.images[0]?.url) {
        imgProp = userState.currentSessionData.playlist.images[0].url
    }
    
    if (!userState.currentSessionData || !userState.currentSessionData.playlist) {
        return (
            <div className={classes.root}>
                Error. Try refreshing page.
            </div>
        )
    }
    return (
        // playlist.images[0].url
        <Grid container direction="row" alignItems="flex-start">
            
            <Box display='flex' width="100%" height="100%" justifyContent='flex-start'>
                <Box>
                    <CardMedia
                        className={classes.cover}
                        image={imgProp}/>
                </Box>
                <Box>
                    <Grid container direction='column' alignItems='flex-start' style={{paddingLeft:25}}>
                        <Typography variant='subtitle1' >Session Id: {userState.currentSessionData.session_uid}</Typography>
                        <Typography variant='subtitle1' style={{fontFamily:'Arial', fontWeight:'bold'}}>PLAYLIST</Typography>
                        <Typography variant='h4' style={{fontWeight:'bold'}} >{userState.currentSessionData.playlist.name}</Typography>
                        {userState.currentSessionData?.playlist?.description ? <Typography variant='h6' color='primary'>{userState.currentSessionData.playlist.description}</Typography> : null}
                        <Grid container direction='row'> 
                            <Typography style={{marginRight: 5}} variant='subtitle1' >
                                Created by
                            </Typography>
                            <Typography style={{marginRight: 5, fontWeight:'bold'}} variant='subtitle1' color='primary'>
                                {userState.currentSessionData.playlist?.owner?.display_name}
                            </Typography>
                            <Typography variant='subtitle1'>
                                - {userState.currentSessionData.playlist.tracks.items.length} songs
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Grid>
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

export default withRouter(SessionDetails) // withRouter enables us to use the router even though this component is not a "Route"