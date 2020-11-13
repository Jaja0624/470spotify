import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

var db = require('./db/dbConnection');

var spotifyRouter = require('./routes/spotify');
var userRouter = require('./routes/user');
var groupRouter = require('./routes/group');

const BACKEND_PORT = '8080';

const app = express();

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

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

// connected clients 
// connectedClientIds = {
//   spotifyId: res
// }

let connectedClientIds: any = {};

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
    delete connectedClientIds[spotifyId];
  })

  if (spotifyId) {
    console.log("adding", spotifyId)
    connectedClientIds[spotifyId] = {res};
  }

  let intervalId = setInterval(async () => {
    console.log('connected clients', Object.keys(connectedClientIds));
    try {
      // connectedClientIds[spotifyId].res.write(`event: message\n data: ${JSON.stringify({ hasUnread: true })} \n\n`)
      connectedClientIds[spotifyId].res.write('event: message\n');
      connectedClientIds[spotifyId].res.write(`data: ${JSON.stringify('connected')}`);
      connectedClientIds[spotifyId].res.write("\n\n");
    } catch (err) {
      console.log(err);
    }
    // res.write('event: message\n');
    // res.write(`data: ${JSON.stringify({ hasUnread: true })}`);
    // res.write("\n\n");
    
  }, 3000)
})

const server = app.listen(BACKEND_PORT, () => {
    console.log(`App listening on port ${BACKEND_PORT}`);
    console.log('Press Ctrl+C to quit.');
});

