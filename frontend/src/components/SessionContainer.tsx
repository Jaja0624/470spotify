import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Box} from '@material-ui/core';
import SessionDetails from './SessionDetails'
import CircularProgress from '@material-ui/core/CircularProgress';
import TrackTable from './TrackTable'
import MiddleContainerHeader from './MiddleContainerHeader'

interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const SessionContainer: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
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
            <div style={{display:'flex', alignItems:'center', marginBottom:12}}>
                <MiddleContainerHeader/>
            </div>
            {loading ? (
                <CircularProgress/>
            ) : (
                <Box>
                    <Box height={200}>
                        <Box style={{paddingLeft:10}} position='bottom'>
                            <SessionDetails/>
                        </Box>
                    </Box>
                    <TrackTable tracks={userState.currentSessionData.playlist?.tracks?.items}/>
                </Box>
            )}
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
        },
        details: {
            maxHeight: '80vh'
        },
    }),
);

export default withRouter(SessionContainer) // withRouter enables us to use the router even though this component is not a "Route"