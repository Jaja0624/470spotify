import express from 'express';
import cors from 'cors';
import { Pool } from 'pg'

const app = express();

app.use(express.json());// be able to read in the body of the req and res
app.use(cors());

const pool = new Pool({
    host:'127.0.0.1',
    user: 'postgres',
    password: 'mfz2gMkiJulF73yi',
    port: 5431,
    database: 'cmpt470db',
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



app.listen(5000, () => console.log('Server Running'));