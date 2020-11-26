import React, { useEffect, useState } from 'react';
import globalStore from '../store/global'
import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Button, Typography} from '@material-ui/core'
import { RouteComponentProps, withRouter} from 'react-router-dom';

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const RightContainerHeader: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const globalState = globalStore();
    const userState = userStore();

    if (globalState.middleContainer !== 'group' && globalState.middleContainer !== 'session') {
        return (
            <div>No group found</div>
        )
    }
    return (
        <div className={classes.root}>
            <Button onClick={() => globalState.setRightContainer('member')}>
                <Typography style={{fontWeight:'bold'}}>Members</Typography>
            </Button>
            <Button disabled={userState.currentSessionData?.data[0]?.session_uid ? false : true} onClick={() => globalState.setRightContainer('chat')}>
                <Typography style={{fontWeight:'bold'}}>Chat</Typography>
            </Button>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    }),
);

export default withRouter(RightContainerHeader) // withRouter enables us to use the router even though this component is not a "Route"