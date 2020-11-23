import React, { useEffect, useState } from 'react';
// import userStore from '../store/user'
// import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, Grid, Box} from '@material-ui/core';
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'

interface IChatMessage {
    name: string,
    msg: string
}
// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {
    groupId: string,
    sessionId: number
}

// FC (function component)
const Chatroom: React.FC<CustomPropsLol> = ({history, groupId, sessionId}: CustomPropsLol) => {
    const [messages, setMessages] = useState<IChatMessage[]>([
        {name: 'author', msg:'hey'},
        {name: 'author', msg:'there'},
        {name: 'author', msg:'bud'}])

    const addMsg = (newMsg: string) => {
        let m = messages;
        let newMsgObj: IChatMessage = {
            name: 'author',
            msg: newMsg
        }
        m.push(newMsgObj);
        setMessages([...m])
        console.log(m);
    }
    
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <ChatMessages messages={messages}/>
            <Box className={classes.input}>
                <ChatInput sendMsg={addMsg}/>
            </Box>
        </div>
    )
}

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        root: {
            flexGrow:1,
            flexDirection:'column'
        },

        input: {
            position:'fixed',
            bottom:0,
            textAlign:'center',
            flexGrow:1,
            paddingLeft: 10,
            paddingBottom: 35
        }
    }),
);

export default withRouter(Chatroom) // withRouter enables us to use the router even though this component is not a "Route"