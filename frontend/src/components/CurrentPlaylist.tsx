import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography } from '@material-ui/core';

interface IObj {
    name: string,
    derp: {},
    awag: string[],
}

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const CurrentPlaylist: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const userState = userStore();

    // executed when component is mounted
    useEffect(() => {
        console.log('this component is mounted');
    })

    return (
        <div className={classes.root}>
            {userState.currentGroup ? (
                <div>
                    {userState.currentGroup.id}-
                    {userState.currentGroup.name}
                </div>
            ) : (
                <div>
                    No group selected
                </div>
            )}
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

export default withRouter(CurrentPlaylist) // withRouter enables us to use the router even though this component is not a "Route"