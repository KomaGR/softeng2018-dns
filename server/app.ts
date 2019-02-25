import * as express from  'express';
import * as bodyParser from  'body-parser';
import routes from './routes/routes';
import * as mongoose from "mongoose";

class App {

    public app: express.Application;
    public mongoUrl: string = 'mongodb://localhost/DNSdb';

    constructor() {
        this.app = express();
        // this.mongoSetup();
        this.config();
    }

    private mongoSetup(): void {
        // mongoose.Promise = global.Promise;
        mongoose.connect(this.mongoUrl, {useNewUrlParser: true});
    }



    private config(): void{
        // support application/json type post data
        this.app.use(bodyParser.json());     
        //support application/x-www-form-urlencoded post data
        this.app.use(bodyParser.urlencoded({extended: false}));
        // serving static files 
        // this.app.use(express.static('public'));
        routes(this.app);
    }
    
}

export default new App().app;
