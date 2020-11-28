import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import SSEManagerInstance  from './SSEClientManager';
import { chatRoomKey, sessionKey } from './utils/socket'
import { joinChatData, messageData } from './types/socket'
import GroupSessionUsers from './GenericList'
var db = require('./db/dbConnection');
import * as dbHelper from './db/dbHelper';
var spotifyRouter = require('./routes/spotify');
var userRouter = require('./routes/user');
var groupRouter = require('./routes/group');
var sessionRouter = require('./routes/session');


import * as SOCKET_STUFF from './constants/socket'
import LoggedInClients from './LoggedInSocketClients'
import SessionRoomManager from './SessionRoomManager'

const BACKEND_PORT = '8080';

const app = express();

const server = app.listen(BACKEND_PORT, () => {
  console.log(`App listening on port ${BACKEND_PORT}`);
  console.log('Press Ctrl+C to quit.');
});


let io = require('./socket').initialize(server);

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

// All paths that start with /api/spotify will go to this router
app.use('/api/spotify', spotifyRouter);
app.use('/api/user', userRouter); // For all paths that start with /api/user
app.use('/api/group', groupRouter); // All paths that start with /api/group gets called to userRouter
app.use('/api/session', sessionRouter);

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
    // console.log('connected clients', SSEManagerInstance.allClientIds());
    console.log('connected clients', LoggedInClients.all())
  }, 5000)
})


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

    socket.on('disconnect', () => {
      console.log('disconnected', socket.id)
      LoggedInClients.remove(socket.id)
      
    })

    socket.on('loggedIn', async function (data: any) {
      const allGroupsForUser = await dbHelper.getAllGroups(data.spotify_uid);

      // add user to rooms for all their groups
      for (let i = 0; i < allGroupsForUser.length; i++) {
        socket.join(allGroupsForUser[i].group_uid)
      }

      const user = {
        spotify_uid: data.spotify_uid,
        pro_pic: data.pro_pic // could be empty string ("")
      }
      LoggedInClients.add(socket.id, user);
    })
    
    socket.on(SOCKET_STUFF.JOIN_CHAT_EVENT, async function(data: joinChatData) {
      // req group_uid
      console.log('joinchat', data);
      socket.join(chatRoomKey(data.group_uid))
      io.to(chatRoomKey(data.group_uid)).emit(SOCKET_STUFF.NEW_MSG_EVENT, {
        group_uid: data.group_uid,
        type: SOCKET_STUFF.MSG_TYPE.STATUS,
        author: SOCKET_STUFF.MSG_TYPE.STATUS,
        msg: data.name + " has joined the chat"
      })
    })

    socket.on(SOCKET_STUFF.LEAVE_CHAT_EVENT, async function(data: joinChatData) {
      console.log('leavechat', data);
      // req group_uid
      socket.leave(chatRoomKey(data.group_uid))
      io.to(chatRoomKey(data.group_uid)).emit(SOCKET_STUFF.NEW_MSG_EVENT, {
        group_uid: data.group_uid,
        type: SOCKET_STUFF.MSG_TYPE.STATUS,
        author: SOCKET_STUFF.MSG_TYPE.STATUS,
        msg: data.name + " has left the chat"
      })
    })

    socket.on(SOCKET_STUFF.NEW_MSG_EVENT, async function(data: messageData) {
      console.log('newmsg', data);
      io.to(chatRoomKey(data.group_uid)).emit(SOCKET_STUFF.NEW_MSG_EVENT, {
        group_uid: data.group_uid,
        type: SOCKET_STUFF.MSG_TYPE.MSG,
        author: data.author,
        msg: data.msg
      })
    })

    socket.on(SOCKET_STUFF.JOIN_SESSION_EVENT, async function (data: joinChatData) {
      console.log("join session ev");
      SessionRoomManager.addUser(data.group_uid, data.spotify_uid)
      console.log('updated group sessions', SessionRoomManager.all());
      socket.join(sessionKey(data.group_uid))
      io.to(chatRoomKey(data.group_uid)).emit(SOCKET_STUFF.NEW_MSG_EVENT, {
        group_uid: data.group_uid,
        type: SOCKET_STUFF.MSG_TYPE.STATUS,
        author: SOCKET_STUFF.MSG_TYPE.STATUS,
        msg: data.name + " has joined the session"
      })
    })

    socket.on(SOCKET_STUFF.LEAVE_SESSION_EVENT, async function (data: joinChatData) {
      console.log("leave session ev");
      SessionRoomManager.removeUser(data.group_uid, data.spotify_uid);
      console.log('updated group sessions', SessionRoomManager);
      socket.leave(sessionKey(data.group_uid))
      io.to(chatRoomKey(data.group_uid)).emit(SOCKET_STUFF.NEW_MSG_EVENT, {
        group_uid: data.group_uid,
        type: SOCKET_STUFF.MSG_TYPE.STATUS,
        author: SOCKET_STUFF.MSG_TYPE.STATUS,
        msg: data.name + " has left the session"
      })
    })
});

