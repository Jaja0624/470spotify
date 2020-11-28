import React, { useState } from 'react';
// import userStore from '../store/user'
// import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { TextField, Typography, Box } from '@material-ui/core';
import { messageData } from '../../types/socket'
// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    messages: messageData[]
}

// FC (function component)
const ChatMessages: React.FC<CustomPropsLol> = ({history, messages}: CustomPropsLol) => {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            {messages.map(msg => {
                return (
                    msg.type === 'msg' ? (
                        <Box display='flex' justify-content='flex-start'>
                            <Typography style={{marginRight: 4}}>{msg.author}:</Typography>
                            <Typography>{msg.msg} </Typography>
                        </Box>
                    ):(
                        <Box>
                            <Typography color='primary'>{msg.msg} </Typography>
                        </Box>
                    )
                )
            })}
            
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow:1
        },
    }),
);

export default withRouter(ChatMessages) // withRouter enables us to use the router even though this component is not a "Route"