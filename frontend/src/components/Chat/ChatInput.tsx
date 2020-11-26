import React, { useState } from 'react';
// import userStore from '../store/user'
// import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { TextField } from '@material-ui/core';

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    sendMsg: (newMsg: string) => void
}

// FC (function component)
const ChatInput: React.FC<CustomPropsLol> = ({history, sendMsg}: CustomPropsLol) => {
    const classes = useStyles();
    const [text, setText] = useState('');

    function keyDownHandler(event: React.KeyboardEvent) {
        if (event.key === 'Enter') {
            console.log(text);
            sendMsg(text);
            setText('');
        }
    }

    return (
        <div className={classes.root}>
            <TextField
                onKeyDown={keyDownHandler}
                variant="outlined"
                multiline
                label='Chat'
                value={text}
                fullWidth={true}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value)}/>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow:1
        },
        input: {
            root: {
                '& .MuiTextField-root': {
                    margin: theme.spacing(1),
                    height:100,
                    width:'100%'
                },
            }
        }
        
    }),
);

export default withRouter(ChatInput) // withRouter enables us to use the router even though this component is not a "Route"