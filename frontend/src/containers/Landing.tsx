import * as React from 'react';
import {Button, Checkbox, Container} from '@material-ui/core';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import userStore from '../store/user'
import { RouteComponentProps } from 'react-router-dom';
import { green } from '@material-ui/core/colors';
import LandingAppBar from '../components/LandingAppBar'
import Grid from '@material-ui/core/Grid';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import Axios from 'axios';

interface Props extends RouteComponentProps {}


const Landing: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const userState = userStore()

    return (
        <div className={classes.root}>
            <Grid className={classes.signIn}>
                <Typography variant="h5" gutterBottom className={`${classes.typography}`}>
                    Sign in
                </Typography>

                <Typography variant="body2" gutterBottom className={`${classes.typography}`}>
                    Connect your spotify account. <br/> Don't have an account?&nbsp;  
                    <Link
                        href="https://www.spotify.com/ca-en/signup/" target="_blank">
                            Sign up now
                    </Link>
                </Typography>

                <Button id="login-but" className={`${classes.loginButton}`} color="primary" onClick={() => {
                    userState.login(() => {
                        console.log('login btn pressed');
                        const obj = {attr1 : "test"};
                        console.log(obj);

                        Axios.post('/api', obj)
                                .then(res => {
                                    console.log(res);
                                })
                        history.push('/app');
                        })
                    window.location.href = 'http://localhost:8888/Login';
                }}>
                    Log in with Spotify
                </Button>

                <Typography variant="body2" gutterBottom className={`${classes.typography}`}>
                    <Link className={`${classes.adminLogin}`}> 
                        admin login
                    </Link>
                </Typography>

                {/* <TextField className={`${classes.input}`} id="login-user" type="text" label="Username" variant="outlined" />
                <TextField className={`${classes.input}`} id="login-pass" type="password" label="Password" variant="outlined" /> */}
            </Grid>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
        minHeight: '100vh'
    },
    signIn: {
        position: 'fixed',
        top: 0,
        bottom: 0,
        left: 0, 
        right: 0,
        borderRadius: theme.shape.borderRadius,
        backgroundColor: '#434343',
        height: 210,
        width: 340,
        margin: 'auto',
        textAlign: 'center',
    },
    signInHead: {
        padding: 10
    },
    container: {
        height:'100vh',
        paddingTop: 80,
        flexGrow: 1,
        margin: 15,
        border: "solid 1px black"
    },
    input: {
        margin: 'auto',
        marginBottom: 5,
        BorderColor: green,
        Float: 'center',
    },
    loginButton: {
        color: 'white',
        background: 'green',
        margin: 10
    },
    typography: {
        margin: 10
    },
    adminLogin: {
        fontSize: 12
    }

  }),
);

export default Landing;
