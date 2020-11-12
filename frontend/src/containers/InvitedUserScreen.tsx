import React, { useEffect, useState }from 'react';
import {
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'
import CircularProgress from '@material-ui/core/CircularProgress';
import globalStore from '../store/global'

const InvitedUserScreen = () => {
    const user = userStore();
    const globalState = globalStore();
    const [loading, setLoading] = useState(true);

    // TODO: Join group *********************************

    const setLoginAfterAction = () => {
        // set group to be shown to user after they have verified auth
        const urlParams = new URLSearchParams(window.location.search);
        const groupId = urlParams.get('groupid'); // case sensitive, view GroupInviteLinkModa.tsx for link string
        if (groupId != null) {
            globalState.setGroupInvite(parseInt(groupId));
            console.log('InvitedUserScreen', groupId)
        }
        setLoading(false);
    }
    
    useEffect(() => {
        console.log("InvitedUserScreen loaded")
        setLoginAfterAction();
    }, [])

    if (loading) {
        return (
            <div>
                <CircularProgress/>
            </div>

        )
    } else {
        return <Redirect to='/app'/>;
    }
}

export default InvitedUserScreen;