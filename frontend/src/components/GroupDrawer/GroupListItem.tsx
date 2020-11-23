import React, { useEffect, useState } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, ListItem, ListItemAvatar, Avatar, ListItemText, Box} from '@material-ui/core';
import IGroup from '../../types/IGroup'
import userStore from '../../store/user'
import globalStore from '../../store/global'

interface Props extends RouteComponentProps {
    groupData: IGroup,
    key: string
}

const GroupListItem: React.FC<Props> = ({history, groupData, key}: Props) => {
    const classes = useStyles();
    const setMiddleContainer = globalStore(state => state.setMiddleContainer);
    const setCurrentGroup = userStore(state => state.setCurrentGroup);
    
    const groupClickHandler = () => {
        setCurrentGroup(groupData.id);
        setMiddleContainer('group');
    }

    return (
        <ListItem button className={classes.root} key={groupData.id} onClick={groupClickHandler}>
            <ListItemAvatar  classes={(groupData?.active?.is_active === true) ? {root: classes.avatar} : undefined}>
                {groupData.img_url 
                ?  <Avatar src={groupData.img_url}/>
                : <Avatar src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"/>
                }
            </ListItemAvatar>
            <ListItemText
                primary={groupData.name}
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
        avatar: {
            backgroundColor: theme.palette.primary.main
        }
    }),
);

export default withRouter(GroupListItem) // withRouter enables us to use the router even though this component is not a "Route"