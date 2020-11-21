import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Button } from '@material-ui/core';
import globalStore from '../store/global'
import SessionDetails from './SessionDetails'
import CircularProgress from '@material-ui/core/CircularProgress';
import TrackList from './TrackList'
// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {

}

// FC (function component)
const SessionContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const globalState = globalStore();
    const classes = useStyles();
    const userState = userStore();
    const [loading, setLoading] = useState(false);

    // executed when component is mounted
    const getSession = async (): Promise<any> => {
        return await userState.getActiveSession()

    }
    useEffect(() => {
        async function load() {
            const res = await getSession();
            setLoading(false);
        }
        setLoading(true);
        load();
    }, []) 

    return (
        <div className={classes.root}>
            <div>
                <Button onClick={() => globalState.setMiddleContainer('session')}>Session If Active (TBD Disable if no session active)</Button>
                <Button onClick={() => globalState.setMiddleContainer('group')}>Group Page</Button>
            </div>
            {loading ? (
                <CircularProgress/>
            ) : (
                <div>
                    <SessionDetails/>
                    <TrackList tracks={userState.currentSessionData.playlist?.tracks?.items}/>
                </div>
            )}

        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
    }),
);

export default withRouter(SessionContainer) // withRouter enables us to use the router even though this component is not a "Route"