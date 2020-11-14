import React, { useEffect, useState }from 'react';
import {
    Redirect,
} from "react-router-dom";
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'js-cookie';

// for auth flow
const AuthLoadingScreen = () => {
    const [loading, setLoading] = useState(true);

    const setAccessToken = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('access_token');
        if (accessToken) {
            Cookies.set('spotifytoken', accessToken);
        } else {
            console.log("access token not found in query string", urlParams);
        }
        setLoading(false);
    }
    useEffect(() => {
        setAccessToken();
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

export default AuthLoadingScreen;