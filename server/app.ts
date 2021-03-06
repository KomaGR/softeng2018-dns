import * as express from  'express';
import * as bodyParser from  'body-parser';
import routes from './routes/routes';
import * as mongoose from "mongoose";
import SessionManager from "./SessionManager";

export const session_manager = new SessionManager();

const PORT_db = 27017;

class App {

    public app: express.Application;
    public readonly mongoUri: string = 'mongodb://localhost:27017/DNSdb';
    public session_manager = new SessionManager();
    public db: mongoose.Connection;


    // public connection = mongoose.createConnection('mongodb://localhost:27017/DNSdb');
     
    constructor() {
        this.app = express();
        this.config();
    }

    public mongoSetup(): void {
        mongoose.connect(this.mongoUri, { useNewUrlParser: true, useCreateIndex: true }, (err: any) => {
            if (err) {
                console.log(err.message);
            } else {
                console.log(`Database is listening on port ${PORT_db}`);
            }
        });
        this.db = mongoose.connection;
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

export default new App();
