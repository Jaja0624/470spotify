import * as React from 'react';
import {
    Route, 
    Redirect,
    RouteProps,
    RouteComponentProps
} from "react-router-dom";

interface PrivateRouteProps extends RouteProps {
    isAuthenticated: boolean;
}

export class AuthenticatedRoute extends Route<PrivateRouteProps> {
    render() {
        return (
            <Route render={(props: RouteComponentProps) => {
                if(!this.props.isAuthenticated) {
					console.log('not logged in. redirect')
                    return <Redirect to='/' />
                } 

                if(this.props.component) {
                    return React.createElement(this.props.component);
                } 

                if(this.props.render) {
                    return this.props.render(props);
                }
            }} />
        );
    }
}