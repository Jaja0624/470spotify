import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

//Structure of the props for this component
interface Props extends RouteComponentProps {
    startDate: Date,
    participants: Array<string>,
    session_uid: number,
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
const GroupPlaylistHistoryItem: React.FC<Props> = ({history, session_uid, startDate, participants, onClickHandler}: Props) => {
    const classes = useStyles();

    //Formats the date.
    const getDate = (date : Date) => {
        var curDate = new Date(date);
        return `${curDate.getFullYear()}-${curDate.getMonth() + 1}-${curDate.getDate()}`;
    };

    return (
        <ListItem button className={classes.root} key={session_uid} onClick={onClickHandler}>
            <ListItemText
                primary={getDate(startDate)}
            />
        </ListItem>
    )
}


export default withRouter(GroupPlaylistHistoryItem);