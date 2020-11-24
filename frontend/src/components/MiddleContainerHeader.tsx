import React, { useEffect, useState } from 'react';
import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Button, Typography} from '@material-ui/core'
import { RouteComponentProps, withRouter} from 'react-router-dom';


// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const MiddleContainerHeader: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const classes = useStyles();
    const globalState = globalStore();

    return (
        <div className={classes.root}>
            <Button onClick={() => globalState.setMiddleContainer('group')}>
                <Typography style={{fontWeight:'bold'}}>Group Page</Typography>
            </Button>
            <Button onClick={() => globalState.setMiddleContainer('session')}>
                <Typography style={{fontWeight:'bold'}}>Session If Active (Disable if no session active)</Typography>
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

export default withRouter(MiddleContainerHeader) // withRouter enables us to use the router even though this component is not a "Route"