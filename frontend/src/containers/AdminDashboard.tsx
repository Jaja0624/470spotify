import React, {useEffect, useState} from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import AdminMainAppBar from '../components/AdminMainAppBar'
import { Tab, Tabs } from '@material-ui/core';
import globalStore from '../store/global';
import userStore from '../store/user';

interface Props extends RouteComponentProps {}

const AdminDashboard: React.FC<Props> = ({history}) => {
    const globalState = globalStore();
    const userState = userStore();
    const classes = useStyles();

    const handleChange = (event : any, newValue: number) => {
        globalState.setAdminTabIndex(newValue);
    };

    const adminTableComponentShow = () => {
        // TODO: populate tables for each DB table
    }

    return (
        <div className={classes.root}>
            <AdminMainAppBar/>
            <br/>
            <br/>
            <br/>
            <div>
                <Tabs value={globalState.adminTabIndex} onChange={handleChange} aria-label="simple tabs example" variant="fullWidth"
                    scrollButtons="on" >
                    <Tab label="AppUser"/>
                    <Tab label="AppGroup"/>
                    <Tab label="GroupMember"/>
                    <Tab label="AppSession"/>
                    <Tab label="SessionAdmin"/>
                    <Tab label="AppHistory"/>
                </Tabs>
                {adminTableComponentShow()}
            </div>
        </div>
    );
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        minHeight: '100vh',
        overflowY: 'hidden' // PREVENT SCROLLING
    },
    smallContainer: {
        flexGrow:1,
        height:'100%',
    },
    container: {
        flexGrow: 1,
        height:'100vh',
        paddingTop: 63,
    },
    box: {
        border: "solid 1px black",
        overflowY: 'auto'
    },
    drawer:{
        overflowY:'auto',
        backgroundColor: theme.drawer.backgroundColor,

    },
    bigBox: {
        width: '100%',
        height: '100%',
        textAlign: 'left',
    },
    smallBox: {
        height: '100%',
        width: '100%',
        float:'left',
        textAlign:'left'
    },
  }),
);

export default withRouter(AdminDashboard) // withRouter enables us to use the router even though this component is not a "Route"