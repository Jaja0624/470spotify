import React, { useEffect, useState } from 'react';
import userStore from '../../store/user'
import globalStore from '../../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { List} from '@material-ui/core';
import GroupListItem from './GroupListItem'
import IGroup from '../../types/IGroup'
interface Props extends RouteComponentProps {
}

const GroupList: React.FC<Props> = ({history}: Props) => {
    const classes = useStyles();
    const userState = userStore();

    return (
            <List className={`some-global-class ${classes.root}`}>
              {userState.userGroups.map((groupData: IGroup) => {
                  return (<GroupListItem key={groupData.id} groupData={groupData}/>)
              })}
            </List>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexDirection: 'row',
            overflowX:'auto',
            width:'100%',
            height:'100%',
            position: 'relative', 
        },
    }),
);

export default withRouter(GroupList) // withRouter enables us to use the router even though this component is not a "Route"