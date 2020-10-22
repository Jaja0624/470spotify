import * as React from 'react';
import userStore from '../store/user'
import { Button } from '@material-ui/core';
import { RouteComponentProps, Redirect, withRouter} from 'react-router-dom';

interface Props extends RouteComponentProps {}


const Dashboard: React.FC<Props> = ({history}) => {
    const userState = userStore()
    return (
        <div>
            Dashboarddd
            <div>
                <Button onClick={() => {
                    userState.logout(() => {
                        console.log('login btn pressed')
                        history.push('/')
                    })
                }}>
                    Logout
                </Button>
            </div>
        </div>
    )
}

export default withRouter(Dashboard)