import * as express from  'express';
import ProductRouter from './ProductRouter';

type Request = express.Request;
type Response = express.Response;

const MainRouter = express.Router();

export default function (
    app: express.Application
) {
    app.use('/observatory/api', MainRouter);
    
    MainRouter
    .get('/', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api");        
        res.status(200).send("NotImplementedError");
    })
    .get('/login', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api/login");
        res.status(200).send("NotImplementedError");
    })
    .get('/logout', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api/logout");
        res.status(200).send("NotImplementedError");
    })

    .use('/products', new ProductRouter().router);
    .use('/prices'), new PriceRouter().router);
    
}