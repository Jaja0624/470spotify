import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, ListItem, Avatar, ListItemText} from '@material-ui/core';
import MusicNoteIcon from '@material-ui/icons/MusicNote';
import AccountCircleRoundedIcon from '@material-ui/icons/AccountCircleRounded';
import OfflineBoltIcon from '@material-ui/icons/OfflineBolt';

interface Props extends RouteComponentProps {
    memberData: any, 
    key: string
}



const MemberListItem: React.FC<Props> = ({history, memberData, key}: Props) => {
    const classes = useStyles();
    const icon = () => {
        if (memberData?.online === false) {
            return <OfflineBoltIcon style={{fontSize: 24}}/>
        } else if (memberData?.pro_pic?.length !== 0) {
            return <Avatar src={memberData?.pro_pic} className={classes.avatar}/>
        } else {
            return <AccountCircleRoundedIcon style={{fontSize: 24}}/>
        }
    }

    const nameText = () => {
        return <Typography className={memberData.online ? classes.onlineType : classes.offlineType}>{memberData.public_name}</Typography>
    }

    return (
        <ListItem button className={classes.root} key={key}>
            {icon()}
            <ListItemText primary={nameText()}/>
            {memberData?.in_session && <MusicNoteIcon/>}

        </ListItem>
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
        onlineType: { // typography styling for online user
            paddingLeft: 4
        },
        offlineType: {
            paddingLeft: 4,
            color: 'grey'
        },
        avatar: {
            height: 24,
            width: 24
        }
    }),
);

export default withRouter(MemberListItem) // withRouter enables us to use the router even though this component is not a "Route"