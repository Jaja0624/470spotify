import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

var db = require('./db/dbConnection');

var spotifyRouter = require('./routes/spotify');

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

// Set Content-Type for all responses for these routes.
app.use((req, res, next) => {
    res.set('Content-Type', 'text/html');
    next();
});

// Create a group associated with a specfic Spotify user
// Insert a group_name into the 'appgroup' table and
// insert a group_uid into the 'groupmember' table.
// Both inserts should happen, or not at all.
const createGroup = async (db : any, groupName : string, spotifyUid : string) => {
    db.transaction(function(trx : any) {
        db('appgroup')
        .insert({group_name: groupName})
        .transacting(trx)
        .returning('group_uid')
        .then(function(groupUid : bigint) {
            console.log("group_uid: " + groupUid + " type: " + typeof(BigInt(groupUid)));
            return trx('groupmember')
                   .insert({group_uid: BigInt(groupUid), spotify_uid: spotifyUid})
        })
        .then(trx.commit)
        .catch(trx.rollback);
  })
  .catch((err : any) => {
    console.log("Error in createGroup: " + err);
  });
};

const getAllGroup = async (db : any) => {
    return await db
      .select('*')
      .from('appgroup')
};

// Grab all groups from a user
const getUserGroup = async (db : any, spotifyUid : string) => {

    return await db('appgroup as ag')
                 .join('groupmember as gm', 'gm.group_uid', 'ag.group_uid')
                 .select('ag.group_uid', 'ag.group_name')
                 .where({spotify_uid : spotifyUid});

    // return await db.raw(`
    //     select ag.group_uid, ag.group_name
    //     from AppGroup ag
    //     join groupmember gm on ag.group_uid = gm.group_uid
    //     where gm.spotify_uid = '${spotifyUid}'
    // `);
};

app.post('/api', async function (req, res) {
    console.log('/api called');
    console.log(req.body);
    try {
        var result = await getAllGroup(db);
        console.log(result);
        res.json(result);
    } catch (err) {
        console.log(err);
        res
          .status(500)
          .send('Unable to load page; see logs for more details.')
          .end();
    }
});

// creates a group
app.post('/api/group/create', async (req, res) => {
    console.log('api/group/create called');
    console.log(req.body);
    try {
        // TODO: replace with spotify_uid from cookies
        var result = await createGroup(db, req.body.groupName, "prq2vz0ahfeet3o4lsonysgjn");
        console.log(result)
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err)
    }
});

// gets all the groups associated with a spotify_uid
app.get('/api/group/user', async (req, res) => {
    console.log('api/group/user called');
    console.log(req.query);
    try {
        var result = await getUserGroup(db, req.query.id as string);
        // console.log("getUserGroup result: " + JSON.stringify(result));
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err)
    }
});

// gets all the groups in the db
app.get('/api/group/all', async (req, res) => {
    console.log('api/group/all called');
    try {
        var result = await getAllGroup(db);
        console.log(result)
        res.json(result);
    } catch (err) {
        console.log(err);
        res.json(err)
    }
});

const server = app.listen(BACKEND_PORT, () => {
    console.log(`App listening on port ${BACKEND_PORT}`);
    console.log('Press Ctrl+C to quit.');
});