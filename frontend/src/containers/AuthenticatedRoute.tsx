import React from 'react';
import {
    Route, 
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'

const AuthenticatedRoute = ({ component, redirectPath, ...rest}: any) => {
    const user = userStore();
    
    const routeComponent = (props: any) => (
        user.spotifyProfile
            ? React.createElement(component, props)
            : <Redirect to={{pathname: redirectPath}}/>
    );

    return <Route {...rest} render={routeComponent}/>;
}

export default AuthenticatedRoute;