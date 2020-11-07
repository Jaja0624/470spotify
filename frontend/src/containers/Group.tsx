import React, { useState } from 'react';
import userStore from '../store/user'
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Grid, Typography, Button } from '@material-ui/core';
import MainAppBar from '../components/MainAppBar'
import GroupMenu from '../components/GroupMenu'

interface Props extends RouteComponentProps { }

const Group: React.FC<Props> = ({ history }) => {
    const classes = useStyles();
    const userState = userStore();
    const [title, setTitle] = useState('Group Name');
    const [members, setMembers] = useState('Group Members');

    return (
        <div className={classes.root}>
            <MainAppBar />
            <GroupMenu />
            <Grid direction='row' container className={classes.container}>
                <Grid item xs={9} className={`${classes.item} ${classes.bigBox}`}>
                    <Typography variant="h6" className={classes.label}>
                    {title}
                    </Typography>
                    <Button  color="primary" variant='contained' className={classes.sessionButton}>
                        Start Session
                    </Button>
                </Grid>
                <Grid item xs={3} className={`${classes.item} ${classes.smallBox}`}>
                    
                <Typography variant="h6" className={classes.label}>
                    {members}
                    </Typography>
                </Grid>
            </Grid>

        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            minHeight: '100vh'
        },
        container: {
            height: '100vh',
            paddingTop: 80,
            flexGrow: 1,
            paddingLeft: '25vh',
            float: 'left'
        },
        item: {
            border: 'solid 1px black',
        },
        bigBox: {
           
        },
        smallBox: {
        },
        label: {
            margin: 10,
        },
        sessionButton: {
            margin: 10,
        }
    }),
);

export default withRouter(Group) // withRouter enables us to use the router even though this component is not a "Route"