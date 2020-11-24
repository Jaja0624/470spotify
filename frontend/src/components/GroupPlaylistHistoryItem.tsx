import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText} from '@material-ui/core';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'

interface Props extends RouteComponentProps {
    startDate: Date,
    participants: Array<string>,
    key: number,
    onClickHandler: any
}

const GroupPlaylistHistoryItem: React.FC<Props> = ({history, key, startDate, participants, onClickHandler}: Props) => {
    const classes = useStyles();

    const getDate = (date : Date) => {
        return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
    };

    return (
        <ListItem button className={classes.root} key={key} onClick={onClickHandler}>
            <ListItemText
                primary={getDate(startDate)}
            />
            <Typography className={classes.small}>
                with
                {
                    participants.map((participant, index, arr) => {
                        return ` ${participant}${arr.length - 1 === index ? '' : ','}`;
                    })
                }
            </Typography>
        </ListItem>
    )
}

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

export default withRouter(GroupPlaylistHistoryItem);