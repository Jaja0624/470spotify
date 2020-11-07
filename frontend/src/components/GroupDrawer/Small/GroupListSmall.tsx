import React, { useEffect, useState } from 'react';
import userStore from '../../../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { List} from '@material-ui/core';
import GroupListItemSmall from './GroupListItemSmall'
import IGroup from '../../../types/IGroup'

interface Props extends RouteComponentProps {}

const GroupListSmall: React.FC<Props> = ({history}: Props) => {
    const classes = useStyles();
    const userState = userStore();

    // executed when component is mounted
    useEffect(() => {
        console.log('this component is mounted');
        console.log(userState.userGroups);
    })
    
    return (
        <div className={classes.root}>
            <List>
              {userState.userGroups.map((groupData: IGroup) => {
                  return (<GroupListItemSmall key={groupData.id} groupData={groupData}/>)
              })}
            </List>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    }),
);

export default withRouter(GroupListSmall) // withRouter enables us to use the router even though this component is not a "Route"