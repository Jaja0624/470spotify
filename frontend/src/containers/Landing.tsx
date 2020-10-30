import * as React from 'react';
import '../css/landing.css';
import {Button, Checkbox} from '@material-ui/core';
import { makeStyles, Theme, createStyles} from '@material-ui/core/styles'
import TextField from '@material-ui/core/TextField';
import userStore from '../store/user'
import { RouteComponentProps } from 'react-router-dom';
import { BorderColor } from '@material-ui/icons';
import { green } from '@material-ui/core/colors';

interface Props extends RouteComponentProps {}


export const Landing: React.FC<Props> = ({history}) => {
    const classes = useStyles();
    const userState = userStore()

    return (
        <body>
            <header>
                <nav className="header">
                    <h1 className="header-title">
                    <span className="header-alt-color">&lt;Project</span>  name&gt;
                    </h1>
                </nav>
            </header>

            <section id="signin">
                <h2>Sign In</h2>
                <p>Connect your &lt;Project name&gt; account. <br/> Don't have an account? 
                    <span className="signup-text">
                        <a className="signup-link" href="#"> Sign up now</a>
                    </span>
                </p>
                
                <section className="login-creds">
                    
                    <TextField className={`${classes.input}`} id="login-user" type="text" label="Username" variant="outlined" />
                    <TextField className={`${classes.input}`} id="login-pass" type="password" label="Password" variant="outlined" />

                    <label htmlFor="remember-me">
                    <Checkbox id="remember-me" className="remember-me"></Checkbox>
                        Remember me
                    </label>

                    <Button id="login-but" className={`${classes.loginButton}`} color="primary" onClick={() => {
                        userState.login(() => {
                            console.log('login btn pressed')
                            history.push('/app');
                        })
                    }}>
                        Sign In
                    </Button>
                </section>
            </section>
        </body>
    )
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    input: {
        marginBottom: 5,
        BorderColor: green
    },
    loginButton: {
        color: 'white',
        background: 'green',
        marginLeft: 30
    }
  }),
);