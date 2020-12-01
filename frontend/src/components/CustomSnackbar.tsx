import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert, { AlertProps } from '@material-ui/lab/Alert';
import { RouteComponentProps, withRouter} from 'react-router-dom';

interface CustomSnackbarProps extends RouteComponentProps {
    open: boolean,
    close: () => void, // this should "at least" set open to false 
    text: string,
    type: "error" | "warning" | "info" | "success",
    duration?: number // duration before auto hide 

}

const CustomSnackbar: React.FC<CustomSnackbarProps> = ({history, open, close, text, type, duration = 6000}: CustomSnackbarProps) => {
    const classes = useStyles();

    function Alert(props: AlertProps) {
        return <MuiAlert elevation={6} variant="filled" {...props} />;
    }

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === 'clickaway') {
          return;
        }
        close();
    };
    return (
        <div className={classes.root}>
            <Snackbar open={open} autoHideDuration={duration} onClose={handleClose}>
                <Alert onClose={handleClose} severity={type}>
                {text}
                </Alert>
            </Snackbar>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            width: '100%',
            '& > * + *': {
                marginTop: theme.spacing(2),
            },
        },
    }),
);

export default withRouter(CustomSnackbar) // withRouter enables us to use the router even though this component is not a "Route"