import * as React from 'react';
import {Button} from '@material-ui/core';
import userStore from '../store/user'
import { RouteComponentProps } from 'react-router-dom';

interface Props extends RouteComponentProps {}


export const Landing: React.FC<Props> = ({history}) => {
    const userState = userStore()
    return (
        <div>
            <h3>Landing Page</h3>
            <div>
                <Button onClick={() => {
                    userState.login(() => {
                        console.log('login btn pressed')
                        history.push('/app');
                    })
                }}>
                    Login
                </Button>
            </div>
        </div>
    )
}