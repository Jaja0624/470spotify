import express from 'express';
import cors from 'cors';
import { Pool } from 'pg'
import config from './config';

const DATABASE_HOST = config.database.host;
const DATABASE_USERNAME = config.database.user;
const DATABASE_PORT : number = +config.database.port;
const DATABASE_PASSWORD = config.database.password;
const DATABASE_NAME = config.database.databaseName;
const SERVER_PORT = config.server.port;

const app = express();

app.use(express.json());// be able to read in the body of the req and res
app.use(cors());

const pool = new Pool({
    host: DATABASE_HOST,
    user: DATABASE_USERNAME,
    password: DATABASE_PASSWORD,
    port: DATABASE_PORT,
    database: DATABASE_NAME,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000
});

app.post('/api', async (req, res) => {
    console.log('/api called');
    console.log(req.body);
    const reqVal = req.body.attr1;
    console.log(`value of attribute in request is ${reqVal}`);

    const results = await pool.query("select * from AppGroup");
    console.table(results.rows);

    res.send('Hello');
});



app.listen(SERVER_PORT, () => console.log(`Server Running ${SERVER_PORT}`));