import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import SSEManagerInstance  from './SSEClientManager';
import { chatRoomKey, sessionKey } from './utils/socket'
import { joinChatData, messageData, playerState} from './types/socket'
var db = require('./db/dbConnection');
import * as dbHelper from './db/dbHelper';
var spotifyRouter = require('./routes/spotify');
var userRouter = require('./routes/user');
var groupRouter = require('./routes/group');
var sessionRouter = require('./routes/session');
var adminRouter = require('./routes/admin');


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

app.use('/api/spotify', spotifyRouter);  // For all paths that start with /api/spotify
app.use('/api/user', userRouter);        // For all paths that start with /api/user
app.use('/api/group', groupRouter);      // For all paths that start with /api/group
app.use('/api/session', sessionRouter);  // For all paths that start with /api/session
app.use('/api/admin', adminRouter);      // For all paths that start with /api/admin

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
    res.end();
    SSEManagerInstance.deleteClient(spotifyId);
  })

  if (spotifyId) {
    console.log("adding", spotifyId)
    SSEManagerInstance.addClient(spotifyId, {res});
  }
})

function chatStatusUpdate(group_uid: string, msg: string) {
  io.to(chatRoomKey(group_uid)).emit(SOCKET_STUFF.NEW_MSG_EVENT, {
    group_uid: group_uid,
    type: SOCKET_STUFF.MSG_TYPE.STATUS,
    author: SOCKET_STUFF.MSG_TYPE.STATUS,
    msg: msg
  })
}

// ROOM KEYS USED THUS FAR
// groupId: number
// sessionKey(groupId): string
// chatRoomKey(groupId): string
// All users join all their groups rooms on log in
// So you can request client to update as needed

// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", function(socket: any) {
    let socketSpotifyUid: string;
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
      const userData = LoggedInClients.remove(socket.id)
      if (socketSpotifyUid && socketSpotifyUid.length != 0) {
        console.log('before updated group sessions', SessionRoomManager.all());
        let groupId = SessionRoomManager.removeUserAllGroups(socketSpotifyUid);
        console.log('updated group sessions', SessionRoomManager.all());
        if (groupId.length > 0) {
          console.log("Disconnected user leaving session", socketSpotifyUid, userData, groupId)
          socket.leave(sessionKey(groupId))
          chatStatusUpdate(groupId, socketSpotifyUid + " has disconnected");
          io.to(parseInt(groupId)).emit('updateMembers')
        }
      } 
    })

    socket.on('loggedOut', () => {
      console.log("logged out socket ev")
      const userData = LoggedInClients.remove(socket.id)
      if (socketSpotifyUid && socketSpotifyUid.length != 0) {
        console.log('before updated group sessions', SessionRoomManager.all());
        let groupId = SessionRoomManager.removeUserAllGroups(socketSpotifyUid);
        console.log('updated group sessions', SessionRoomManager.all());
        if (groupId.length > 0) {
          console.log("Disconnected user leaving session", socketSpotifyUid, userData, groupId)
          socket.leave(sessionKey(groupId))
          chatStatusUpdate(groupId, socketSpotifyUid + " has disconnected");
          io.to(parseInt(groupId)).emit('updateMembers')
        }
      } 
    })

    socket.on('loggedIn', async function (data: any) {
      console.log("loggedIn ev", data)
      socketSpotifyUid = data.spotify_uid;
      const allGroupsForUser = await dbHelper.getAllGroups(data.spotify_uid);

      // add user to rooms for all their groups
      // enables us to force client to update when a group state changes
      for (let i = 0; i < allGroupsForUser.length; i++) {
        console.log("user " + data.spotify_uid + " joined group socket room " + allGroupsForUser[i].group_uid)
        console.log(typeof(allGroupsForUser[i].group_uid))
        socket.join(allGroupsForUser[i].group_uid)
        io.to(parseInt(allGroupsForUser[i].group_uid)).emit('updateMembers')
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
      chatStatusUpdate(data.group_uid, data.name + " has joined the chat");
    })

    socket.on(SOCKET_STUFF.LEAVE_CHAT_EVENT, async function(data: joinChatData) {
      console.log('leavechat', data);
      // req group_uid
      socket.leave(chatRoomKey(data.group_uid))
      chatStatusUpdate(data.group_uid, data.name + " has left the chat");
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
    
      chatStatusUpdate(data.group_uid, data.name + " has joined the session");
      io.to(data.group_uid).emit('updateMembers')
    })

    socket.on(SOCKET_STUFF.LEAVE_SESSION_EVENT, async function (data: joinChatData) {
      console.log("leave session ev", data);
      console.log('before updated group sessions', SessionRoomManager.all());
      SessionRoomManager.removeUser(data.group_uid, data.spotify_uid);
      console.log('updated group sessions', SessionRoomManager.all());
      socket.leave(sessionKey(data.group_uid))
      chatStatusUpdate(data.group_uid, data.name + " has left the session");
      io.to(data.group_uid).emit('updateMembers')
    })

    socket.on(SOCKET_STUFF.SESSION_MUSIC_CHANGE, async function (newState: playerState) {
      console.log(SOCKET_STUFF.SESSION_MUSIC_CHANGE, newState)
      const groupId = SessionRoomManager.findGroup(socketSpotifyUid)
      if (groupId > 0) {
        console.log("player update", groupId)
        io.to(sessionKey(groupId)).emit(SOCKET_STUFF.UPDATE_PLAYER, newState)
      }
    })
});

