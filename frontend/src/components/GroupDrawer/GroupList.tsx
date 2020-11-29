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
        '@global': {
            '*::-webkit-scrollbar': {
            width: '10px'
            },
            '*::-webkit-scrollbar-track': {
            '-webkit-box-shadow': 'inset 0 0 6px rgba(44, 47, 51,0.9)'
            },
            '*::-webkit-scrollbar-thumb': {
            '-webkit-border-radius': '10px',
            'border-radius': '10px',
            'background': 'rgba(44, 47, 51,0.9)' 
            }
        }
    }),
);

export default withRouter(GroupList) // withRouter enables us to use the router even though this component is not a "Route"