import React, { useEffect, useState }from 'react';
import {
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'
import CircularProgress from '@material-ui/core/CircularProgress';
import globalStore from '../store/global'
import shallow from 'zustand/shallow'

const InvitedUserScreen = () => {
    const {
        setGroupInvite, 
        setMiddleContainer, 
    } = globalStore(state => ({ 
        setGroupInvite: state.setGroupInvite, 
        setMiddleContainer: state.setMiddleContainer,
    }), shallow);

    const [loading, setLoading] = useState(true);

    // TODO: Join group *********************************

    const setLoginAfterAction = () => {
        // set group to be shown to user after they have verified auth
        const urlParams = new URLSearchParams(window.location.search);
        const groupId = urlParams.get('groupid'); // case sensitive, view GroupInviteLinkModa.tsx for link string
        if (groupId != null) {
            setGroupInvite(parseInt(groupId));
            setMiddleContainer('group');
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