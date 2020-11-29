import React, { useEffect, useState } from 'react';
import userStore from '../../store/user'
// import globalStore from '../store/global'
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles'
import { RouteComponentProps, withRouter} from 'react-router-dom';
import { Typography, Grid, Box} from '@material-ui/core';
import ChatInput from './ChatInput'
import ChatMessages from './ChatMessages'
import { socket } from '../../core/socket'
import { joinChatData, messageData } from '../../types/socket'

// extending RouteComponentProps allow us to bring in prop types already declared in RouteComponentProps
interface CustomPropsLol extends RouteComponentProps {}

// FC (function component)
const Chatroom: React.FC<CustomPropsLol> = ({history}: CustomPropsLol) => {
    const userState = userStore()
    const [messages, setMessages] = useState<messageData[]>([])

    // adds new message to client's chatroom
    const addNewMessage = (newMsg: messageData) => {
        let m = messages;
        m.push(newMsg);
        setMessages([...m])
        console.log("updated msgs", m);
    }

    // sends new message to server via socket
    const sendNewMessageToServer = (msg: string) => {
        let newMsgObj: messageData = {
            group_uid: userState.currentGroup?.id!,
            type: "msg",
            author: userState.spotifyProfile.display_name,
            msg: msg
        }
        socket.emit('newMessage', newMsgObj);
    }
    
    const classes = useStyles();

    useEffect(() => {
        messages.length = 0; // weird but works 
        let clientData: joinChatData = {
            group_uid: userState.currentGroup?.id!,
            spotify_uid: userState.spotifyProfile.id,
            name: userState.spotifyProfile.display_name
        }
        socket.emit('joinChat', clientData)

        socket.on('newMessage', (data: messageData) => {
            addNewMessage(data);
            console.log("new msg", data)
        })

        return () => {
            socket.emit('leaveChat', clientData);
        }
    }, [userState.currentGroup])
    return (
        <div className={classes.root}>
            <ChatMessages messages={messages}/>
            <Box className={classes.input}>
                <ChatInput sendMsg={sendNewMessageToServer}/>
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
            paddingBottom: 100
        }
    }),
);

export default withRouter(Chatroom) // withRouter enables us to use the router even though this component is not a "Route"