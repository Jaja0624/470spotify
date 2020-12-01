import React, {useEffect, useState} from 'react';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import AdminMainAppBar from '../components/AdminMainAppBar'

interface Props extends RouteComponentProps {}

const AdminDashboard: React.FC<Props> = ({history}) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AdminMainAppBar/>
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