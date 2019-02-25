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
        res.status(401).send("NotImplementedError");
    })
    .post('/login', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api/login");
        res.status(200).send(
            {token : "deadbeef"}      // Mock reply
            );
    })
    .post('/logout', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api/logout");
        res.status(200).send(
            {message : "OK"}          // Mock reply
            );
    })
    .post('/signup', (req: Request, res: Response) => {
        console.log("Hit on /observatory/api/signup");
        res.status(200).send(
            {message : "OK"}          // Mock reply
            );
    })
    .use('/products', new ProductRouter().router);
    
    // MainRouter.use('/shops', shopRouter);
    // MainRouter.use('/prices', priceRouter);
    
}