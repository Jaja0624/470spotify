import React, { Component, useState } from "react";
import Dialog from "@material-ui/core/Dialog";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { verifyAdmin } from '../core/admin';
import { withRouter } from 'react-router-dom';

class AdminLoginScreen extends Component <any, any> {
    constructor(props : any) {
        super(props);
        this.state = {
            password: "",
            message: "",
            open: false,
            verified: false
        };
    }

    setPassword = (event : any) => {
        this.setState({
            password: event.target.value
        });
    };

    signIn = async () => {
        const verified = await verifyAdmin(this.state.password);

        // If the SQL query results in a row (correct password)
        if (verified.status == 200 && verified.data.length > 0) {
            this.setState({open: true,
                           message: "You have successfully Logged In!",
                           verified: true});
        }
        else {
            return this.setState({open: true,
                                  message: "Incorrect Username or Password!"});
        }
    };

    handleClose = () => {
        this.setState({
            open: false
        });
    };

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <div className="Login">
                        <TextField variant="standard"
                                   placeholder="Password"
                                   margin="normal"
                                   required
                                   type="password"
                                   onChange={this.setPassword}
                                   value={this.state.password}
                        />

                        <div className="Button">
                            <Button variant="contained"
                                    color="primary"
                                    onClick={() => {
                                        this.signIn();
                                    }}>Log In
                            </Button>
                        </div>
                    </div>
                    <Dialog open={this.state.open}
                            onClose={this.handleClose}
                            aria-labelledby="alert-dialog-title"
                            aria-describedby="alert-dialog-description">
                        <DialogTitle id="alert-dialog-title">Sign In</DialogTitle>
                        <DialogContent>
                            <DialogContentText id="alert-dialog-description">
                                {this.state.message}
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={this.handleClose}
                                    color="primary">Okay
                            </Button>
                        </DialogActions>
                    </Dialog>
                </header>
            </div>
        );
    }
}

export default withRouter(AdminLoginScreen);