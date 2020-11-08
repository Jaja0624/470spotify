import React, { useEffect, useState }from 'react';
import {
    Route, 
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'
import axios, {AxiosResponse} from 'axios';
import CircularProgress from '@material-ui/core/CircularProgress';

export const AuthenticatedRoute = ({ component, ...rest}: any) => {
    const user = userStore();
    const [loading, setLoading] = useState(true);

    const getCurrentUserData = async (): Promise<AxiosResponse> => {
        const aa = new URLSearchParams(window.location.search);
        const accessToken = aa.get('access_token');
        return await axios.get('https://api.spotify.com/v1/me', {
            headers: {
                'Authorization': `Bearer ${accessToken}`
            }
        })
    }

    const verifyAccessToken = async () => {
        const result = await getCurrentUserData();
        if (result.status === 200) {
            user.setSpotifyProfile(result.data);
        }
        setLoading(false);
    }
    useEffect(() => {
        verifyAccessToken();
    })
    
    const routeComponent = (props: any) => (
        user.authenticated
            ? React.createElement(component, props)
            : <Redirect to={{pathname: '/'}}/>
    );

    if (loading) {
        return (
            <div>
                <CircularProgress/>
            </div>

        )
    } else {
        return <Route {...rest} render={routeComponent}/>;
    }
}
