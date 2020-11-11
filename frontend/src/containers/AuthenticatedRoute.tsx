import React, {useEffect, useState}from 'react';
import {
    Route, 
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'
import Cookies from 'js-cookie';
import {getUserProfile, getPlaylists} from '../core/spotify';
import CircularProgress from '@material-ui/core/CircularProgress';

const AuthenticatedRoute = ({ component, redirectPath, ...rest}: any) => {
    const user = userStore();
    const [loading, setLoading] = useState(true);
    const verifyAccessToken = async () => {
        const accessToken = Cookies.get('spotifytoken');
        if (accessToken) {
            console.log("access token found", accessToken);
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
            console.log('access token not found');
        }
    }
    useEffect(() => {
        async function test() {
            await verifyAccessToken();
            setLoading(false);
        }
        test();
    }, [])

    // const routeComponent = (props: any) => (
    //     user.spotifyProfile
    //         ? React.createElement(component, props)
    //         : <Redirect to={{pathname: redirectPath}}/>
    // );

    if (loading) {
        return (
            <div>
                <CircularProgress/>
            </div>

        )
    } else {
        return (
            <Route {...rest} render={(props: any) => (
                user.spotifyProfile 
                ? (
                    React.createElement(component, props)
                ) : (
                    <Redirect to={{pathname: redirectPath}}/>
                )
            )}/>
        )
    }
}

export default AuthenticatedRoute;