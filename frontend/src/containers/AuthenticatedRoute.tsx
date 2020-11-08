import React from 'react';
import {
    Route, 
    Redirect,
} from "react-router-dom";
import userStore from '../store/user'

const AuthenticatedRoute = ({ component, ...rest}: any) => {
    const user = userStore();
    
    const routeComponent = (props: any) => (
        user.spotifyProfile
            ? React.createElement(component, props)
            : <Redirect to={{pathname: '/'}}/>
    );

    return <Route {...rest} render={routeComponent}/>;
}

export default AuthenticatedRoute;