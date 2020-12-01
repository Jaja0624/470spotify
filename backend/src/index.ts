import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import SSEManagerInstance  from './SSEClientManager';
import { chatRoomKey } from './utils/socket'
import { joinChatData, messageData } from './types/socket'
var db = require('./db/dbConnection');

var spotifyRouter = require('./routes/spotify');
var userRouter = require('./routes/user');
var groupRouter = require('./routes/group');
var sessionRouter = require('./routes/session');

const BACKEND_PORT = '8080';

const app = express();
var socket = require('socket.io');

// debug
function SOCKETIO_PRINT(...args : any) {
    console.log("SOCKET.IO:", args);
}

// Automatically parse request body as form data.
app.enable('trust proxy');
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// Routers

app.use('/api/spotify', spotifyRouter);  // For all paths that start with /api/spotify
app.use('/api/user', userRouter);        // For all paths that start with /api/user
app.use('/api/group', groupRouter);      // For all paths that start with /api/group
app.use('/api/session', sessionRouter);  // For all paths that start with /api/session

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

// a logged in client will be connected to this stream
app.get('/stream', (req, res) => {
  const headers = {
    'Content-Type': 'text/event-stream',
    'Connection': 'keep-alive',
    'Cache-Control': 'no-cache'
  }
  res.writeHead(200, headers)

  const spotifyId: string = req.query.spotifyid as string;

  res.on('close', () => {
    console.log('sse closed');
    clearInterval(intervalId);
    res.end();
    SSEManagerInstance.deleteClient(spotifyId);
  })

  if (spotifyId) {
    console.log("adding", spotifyId)
    SSEManagerInstance.addClient(spotifyId, {res});
  }

  let intervalId = setInterval(async () => {
    console.log('connected clients', SSEManagerInstance.allClientIds());
  }, 5000)
})

const server = app.listen(BACKEND_PORT, () => {
    console.log(`App listening on port ${BACKEND_PORT}`);
    console.log('Press Ctrl+C to quit.');
});

let io = socket(server);


const JOIN_CHAT_SOCK_EV = 'joinChat'
const LEAVE_CHAT_SOCK_EV = 'leaveChat'
const NEW_MSG_SOCK_ENV = 'newMessage'
const MSG_TYPE_MSG = 'msg'
const MSG_TYPE_STATUS = 'status'
// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
    SOCKETIO_PRINT("a user connected", socket.id);
    socket.on('clientEvent', async function(data : any) {

        SOCKETIO_PRINT("Received client event. Data:", data);
        SOCKETIO_PRINT("data.group_uid: " + data.group_uid);
        SOCKETIO_PRINT("socket.id: " + socket.id);

        socket.join(data.group_uid);

        // all users in the same group
        const ids = await io.in(data.group_uid).allSockets();
        SOCKETIO_PRINT("All users in group_uid: " + data.group_uid, ids);

        // Send this event to everyone in the same group
        io.sockets.in(data.group_uid).emit('connectToSession', 'HEYOOOOOOO');
    });

    socket.on(JOIN_CHAT_SOCK_EV, async function(data: joinChatData) {
      // req group_uid
      console.log('joinchat', data);
      socket.join(chatRoomKey(data.group_uid))
      io.to(chatRoomKey(data.group_uid)).emit(NEW_MSG_SOCK_ENV, {
        group_uid: data.group_uid,
        type: MSG_TYPE_STATUS,
        author: MSG_TYPE_STATUS,
        msg: data.name + " has joined the chat"
      })
    })

    socket.on(LEAVE_CHAT_SOCK_EV, async function(data: joinChatData) {
      console.log('leavechat', data);
      // req group_uid
      socket.leave(chatRoomKey(data.group_uid))
      io.to(chatRoomKey(data.group_uid)).emit(NEW_MSG_SOCK_ENV, {
        group_uid: data.group_uid,
        type: MSG_TYPE_STATUS,
        author: MSG_TYPE_STATUS,
        msg: data.name + " has left the chat"
      })
    })

    socket.on(NEW_MSG_SOCK_ENV, async function(data: messageData) {
      console.log('newmsg', data);
      io.to(chatRoomKey(data.group_uid)).emit(NEW_MSG_SOCK_ENV, {
        group_uid: data.group_uid,
        type: MSG_TYPE_MSG,
        author: data.author,
        msg: data.msg
      })
    })
});