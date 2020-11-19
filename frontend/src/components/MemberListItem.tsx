import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText} from '@material-ui/core';


interface Props extends RouteComponentProps {
    memberData: any, 
    key: string
}

const MemberListItem: React.FC<Props> = ({history, memberData, key}: Props) => {
    const classes = useStyles();

    return (
        <ListItem button className={classes.root} key={key}>
            <ListItemText
                primary={memberData.public_name}
            />
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
    }),
);

export default withRouter(MemberListItem) // withRouter enables us to use the router even though this component is not a "Route"