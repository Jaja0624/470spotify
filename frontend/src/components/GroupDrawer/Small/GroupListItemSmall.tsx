import React, { useEffect } from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { ListItem, ListItemAvatar, Avatar} from '@material-ui/core';
import IGroup from '../../../types/IGroup'
import userStore from '../../../store/user'

interface Props extends RouteComponentProps {
    groupData: IGroup,
    key: string
}

const GroupListItemSmall: React.FC<Props> = ({history, groupData, key}: Props) => {
    const classes = useStyles();

    const setCurrentGroup = userStore(state => state.setCurrentGroup);
    
    // executed when component is mounted
    useEffect(() => {
        console.log("GroupListItemSmall groupData", groupData);
        console.log("GroupListItemSmall key", key);
    })

    return (
        <ListItem button className={classes.root} key={groupData.id} onClick={() => {setCurrentGroup(groupData.id)}}>
            <ListItemAvatar  classes={(groupData?.active?.is_active === true) ? {root: classes.avatar} : undefined}>
                {groupData.img_url 
                ?  <Avatar src={groupData.img_url}/>
                : <Avatar src="https://upload.wikimedia.org/wikipedia/commons/f/f9/Phoenicopterus_ruber_in_S%C3%A3o_Paulo_Zoo.jpg"/>
                }
            </ListItemAvatar>
        </ListItem>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            textAlign:'center',
            justifyContent:'center',
            alignItems:'center',
        },
        avatar: {
            backgroundColor: theme.palette.primary.main
        }
    }),
);

export default withRouter(GroupListItemSmall) // withRouter enables us to use the router even though this component is not a "Route"