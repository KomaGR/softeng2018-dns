import * as express from  'express';
import * as bodyParser from  'body-parser';
import routes from './routes/routes';

class App {
    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
    }

    private config(): void{
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({extended: false}));
        routes(this.app);
    }

    
}

export default new App().app;