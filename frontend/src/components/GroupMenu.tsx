import React, { useState } from 'react';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { Grid, Typography, IconButton, List } from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props extends RouteComponentProps { }

const GroupMenu: React.FC<Props> = ({ history }) => {
    const classes = useStyles();
    const [title, setTitle] = useState('Groups');
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div className={classes.root}>
            <Grid direction='column' item xs={2} className={`${classes.item}`}>
                <Grid>
                    <IconButton
                        edge="end"
                        aria-label="addGroup"
                        className={`${classes.addGroup}`}
                        onClick={handleOpen}
                    >
                        <AddIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                </Grid>

                <List className={`${classes.groups}`}>
                    TODO: Groups here
                </List>

            </Grid>

            <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
                <DialogTitle id="form-dialog-title">Add New Group</DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="groupName"
                        label="Group Name"
                        type="text"
                        fullWidth
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose} color="primary" variant='outlined'>
                        Cancel
                    </Button>
                    <Button onClick={handleClose} color="primary" variant='contained'>
                        Add Group
                    </Button>
                </DialogActions>
            </Dialog>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {

        },
        item: {
            left: 0,
            position: 'fixed',
            display: 'flex',
            paddingTop: 65,
            height: '100vh',
            width: ' 25vh',
            minWidth: '25vh',
            backgroundColor: theme.palette.secondary.light
        },
        title: {
            margin: 15,
            maxWidth: 80
        },
        addGroup: {
            float: 'right',
            margin: 5,
            fontSize: 'small'
        },
        groups: {
            height: '100vh',
            margin: 15,
        }
    }),
);

export default withRouter(GroupMenu) // withRouter enables us to use the router even though this component is not a "Route"

