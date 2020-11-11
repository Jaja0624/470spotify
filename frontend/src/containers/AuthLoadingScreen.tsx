import React, { useEffect, useState }from 'react';
import {
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'
import { getUserProfile, getPlaylists} from '../core/spotify'
import CircularProgress from '@material-ui/core/CircularProgress';
import Cookies from 'js-cookie';

const AuthLoadingScreen = () => {
    const user = userStore();
    const [loading, setLoading] = useState(true);

    const verifyAccessToken = async () => {
        const aa = new URLSearchParams(window.location.search);
        const accessToken = aa.get('access_token');
        if (accessToken) {
            Cookies.set('spotifytoken', accessToken);
            console.log('access token set');
            const userProfile = await getUserProfile(accessToken);
            const playlists = await getPlaylists(accessToken, userProfile.data.id)
            if (userProfile.status === 200) {
                user.setSpotifyProfile(userProfile.data);
                console.log(userProfile.data)
            }
            if (playlists.status === 200) {
                user.setUserPlaylists(playlists.data.items);
                console.log(playlists.data);
            }
        } else {
            console.log("access token not found in query string", aa);
        }
        setLoading(false);
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