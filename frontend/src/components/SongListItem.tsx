import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

import Song from '../types/Song';

//Structure of the props for this component
interface Props extends RouteComponentProps {
    song: Song,
    isAppUserVisible : boolean, 
    isGroupNameVisible : boolean, 
    isDateAddedVisible : boolean,
    onClickHandler: () => void
}

//Styles used for components
const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            paddingLeft: 5,
            justifyContent:'center',
            alignItems:'center',
            width: '100%',
            position: 'relative'
        },
        small: {
            fontSize: 12,
            position: 'absolute',
            top: '65%',
            left: 5
        }
    })
);

//Shows the session playlist in a group as a date and its participants.
const SongListItem: React.FC<Props> = ({history, song, isAppUserVisible, isGroupNameVisible, isDateAddedVisible, onClickHandler}: Props) => {
    const classes = useStyles();

    const getSongKey = (song: Song) => {
        return `${song.date_added.getTime()}${song.app_user}`;
    };

    const getDate = (date : Date) => {
        return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}`;
    }

    const getDescription = (song: Song, isAppUserVisible : boolean, isGroupNameVisible : boolean, isDateAddedVisible : boolean) => {
        var output = "";
        if(isAppUserVisible){
            output = output.concat(`added by ${song.app_user} `);
        }
        if(isGroupNameVisible){
            output = output.concat(`in '${song.group_name} '`);
        }
        if(isDateAddedVisible){
            output = output.concat(`on ${getDate(song.date_added)} `);
        }
        return output;
    };

    return (
        <ListItem button key={getSongKey(song)} onClick={onClickHandler} className={classes.root}>
            <ListItemText
                primary={song.songname}
            />
            <Typography className={classes.small}>
                {getDescription(song, isAppUserVisible, isGroupNameVisible, isDateAddedVisible)}
            </Typography>
        </ListItem>
    )
}


export default withRouter(SongListItem);