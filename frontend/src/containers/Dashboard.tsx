import * as React from 'react';
import userStore from '../store/user'
import { Button, AppBar, Toolbar, IconButton, Typography} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { RouteComponentProps, Redirect, withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'
import MainAppBar from '../components/MainAppBar'

interface Props extends RouteComponentProps {}


const Dashboard: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const userState = userStore()
    return (
        <div className={classes.root}>
            <MainAppBar/>
            Dashboarddd
            <div>
                
            </div>
        </div>
    )
}

const useStyles = makeStyles({
    root: {
        background:'red'
    }
});

export default withRouter(Dashboard)