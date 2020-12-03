
import React, { useEffect, useState } from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Box } from '@material-ui/core'
import userStore from '../store/user';
import globalStore from '../store/global';
import HomeSessionItems from '../components/HomeSessionItems'
import { getActiveAll } from '../core/server'
import Cookies from 'js-cookie'
import { ISessionData } from '../types/ISessionData';

interface Props extends RouteComponentProps{
    //no props to send   
}

// The right hand container of the application. This component manages the additional 
// information of the group like its member list, playlist history, and group settings.
const OtherLiveSessions: React.FC<Props> = () => {
    const globalState = globalStore();
    const userState = userStore();
    const [sessions, setSessions] = useState([])

    useEffect(() => {
        async function getAll() {
            try {
                const res = await getActiveAll(Cookies.get('spotifytoken')!)
                setSessions(res.data)
                console.log("SESES", res.data)
            } catch (err) {
                console.log(err)
            }
        }
        if (userState.validateAuthenticated()) {
            getAll();
        }
        
    }, [])
    return (
        <Box height="100%">
            {sessions && sessions.map((session: ISessionData) => {
                return (
                    <Box paddingY="15px">
                        <HomeSessionItems sessionData={session}/>
                    </Box>
                )
            })}
        </Box>
    );
};

export default withRouter(OtherLiveSessions);