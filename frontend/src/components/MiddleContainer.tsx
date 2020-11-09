import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography } from '@material-ui/core';
import UserPlaylists from './UserPlaylists'

interface IObj {
    name: string,
    derp: {},
    awag: string[],
}

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const MiddleContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();
    const globalState = globalStore();

    const ifhandler = () => {
        if (globalState.middleContainer === 'group' && userState.currentGroup) {
            return (
                <div>
                    {userState.currentGroup.id}-
                    {userState.currentGroup.name}
                </div>
            )
        } else {
            return (
                <UserPlaylists/>
            )
        }
    }

    return (
        <div className={classes.root}>
            {ifhandler()}
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            textAlign:'center',
            padding:15
        },
    }),
);

export default withRouter(MiddleContainer) // withRouter enables us to use the router even though this component is not a "Route"