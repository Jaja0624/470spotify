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

const server = app.listen(BACKEND_PORT, () => {
    console.log(`App listening on port ${BACKEND_PORT}`);
    console.log('Press Ctrl+C to quit.');
});
