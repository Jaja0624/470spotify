import React, { useEffect, useState }from 'react';
import {
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'
import { getUserProfile } from '../core/spotify'
import CircularProgress from '@material-ui/core/CircularProgress';

const AuthLoadingScreen = () => {
    const user = userStore();
    const [loading, setLoading] = useState(true);

    const verifyAccessToken = async () => {
        const aa = new URLSearchParams(window.location.search);
        const accessToken = aa.get('access_token');
        if (accessToken) {
            const result = await getUserProfile(accessToken);
            if (result.status === 200) {
                user.setSpotifyProfile(result.data);
            }
            setLoading(false);
        } else {
            console.log("access token not found in query string", aa);
        }
    }
    useEffect(() => {
        verifyAccessToken();
    })

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

export default AuthLoadingScreen;