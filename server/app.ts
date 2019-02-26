import * as express from  'express';
import * as bodyParser from  'body-parser';
import routes from './routes/routes';
import * as mongoose from "mongoose";

const Mongod = require('mongod');

const assert = require('assert');
const MongoClient = require('mongodb').MongoClient;

const PORT_db = 27017;


// Simply pass the port that you want a MongoDB server to listen on.
const server = new Mongod(PORT_db);

// Database Name
const dbName = 'DNSdb';


// Connection URL
const url = 'mongodb://localhost:27017';


class App {

    public app: express.Application;
    public readonly mongoUri: string = 'mongodb://127.0.0.1:27017/DNSdb';

    // public connection = mongoose.createConnection('mongodb://localhost:27017/DNSdb');
     
    constructor() {
        this.app = express();
        this.mongoSetup();
        this.config();
    }

    private mongoSetup(): void {

        mongoose.connect(this.mongoUri, { useNewUrlParser: true }, (err: any) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(`Database is listening on port ${PORT_db}`);
            }
        });
    }

    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());     
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({extended: false}));
        // serving static files 
        this.app.use(express.static('public'));
        routes(this.app);
    }
    
}

export default new App().app;
