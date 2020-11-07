import React, { useEffect, useState } from 'react';
import userStore from '../store/user'
import { Button, TextField, Dialog, DialogTitle, DialogContent, DialogActions} from '@material-ui/core';
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles'

interface Props extends RouteComponentProps {
    isOpen: boolean,
    cancelHandler: () => void, // when user clicks cancel
    saveHandler: (groupName: string) => void // save handler
}

// create group popup
const CreateGroupDialog: React.FC<Props> = ({history, isOpen, cancelHandler, saveHandler}: Props) => {
    const classes = useStyles();
    const userState = userStore();
    const [groupName, setGroupName] = useState('');
    
    useEffect(() => {
        setGroupName('');
    }, [isOpen])

    return (
        <Dialog open={isOpen} onClose={cancelHandler} aria-labelledby="form-dialog-title">
            <DialogTitle id="form-dialog-title">Add New Group</DialogTitle>
            <DialogContent>
                <TextField
                    autoFocus
                    value={groupName}
                    onChange={(val) => setGroupName(val.target.value)}
                    margin="dense"
                    id="groupName"
                    label="Group Name"
                    type="text"
                    fullWidth
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={cancelHandler} color="primary" variant='outlined'>
                    Cancel
                </Button>
                <Button onClick={() => saveHandler(groupName)} color="primary" variant='contained'>
                    Add Group
                </Button>
            </DialogActions>
        </Dialog>

    )
}

const useStyles = makeStyles({
    root: {
        display:'flex',
        flexDirection:'column',
        justifyContent:'center'
    },
    title: {
        flexGrow:1
    }
});

export default withRouter(CreateGroupDialog) // withRouter enables us to use the router even though this component is not a "Route"