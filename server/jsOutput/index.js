"use strict";
// command npm run dev to run the server in development
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express")); //framework to make middleware
var cors_1 = __importDefault(require("cors")); //be able to make http requests to and from react and node
var pg_1 = require("pg");
var app = express_1.default();
app.use(express_1.default.json()); // be able to read in the body of the req and res
app.use(cors_1.default());
//in order to connect to cloud sql, we use a proxy via google cloud sdk
/*
    Useful links:
    https://cloud.google.com/sdk/docs/install // to install google cloud sdk to your local computer
    https://cloud.google.com/sql/docs/postgres/connect-admin-proxy // follow step 2 (assuming windows) to download the proxy
    
    go to your google sdk terminal to the path of where you downloaded the proxy

    put this in google sdk terminal : cloud_sql_proxy -instances=cmpt470-proj:northamerica-northeast1:cmpt470db=tcp:5431
*/
var client = new pg_1.Client({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'mfz2gMkiJulF73yi',
    port: 5431,
    database: 'cmpt470db'
});
app.post('/api', function (req, res) {
    console.log('/api called');
    console.log(req.body);
    var reqVal = req.body.attr1;
    console.log("value of attribute in request is " + reqVal);
    client.connect()
        .then(function () { return console.log("Connected successfully to the database proxy"); })
        .then(function () { return client.query("select * from AppGroup"); })
        .then(function (results) { return console.table(results.rows); })
        .catch(function (e) { return console.log(e); })
        .finally(function () { return client.end(); });
    res.send('Hello');
});
app.listen(5000, function () { return console.log('Server Running'); });
