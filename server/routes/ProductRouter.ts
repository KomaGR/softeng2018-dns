import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

/*  Note:   This class is subject to later abstraction via passing
            {method, path, callee} vectors. Hence the warning 
            below.
*/
export default class {
    public router: express.Router;

    constructor() {
        this.router = express.Router();
        this.config();
    }

    // WARNING: DO NOT HANDLE REQUESTS HERE! DISPATCH THEM
    //          TO APPROPRIATE FILES.
    private config(): void {
        this.router
        .get('/', (req: Request, res: Response) => {
            console.log("Hit on /observatory/api/products");
            // TODO: Send all products
        })
        .post('/', (req: Request, res: Response) => {
            console.log("Hit on /observatory/api/products");
            // TODO: Register new product
        })
        .get('/:id', (req: Request, res: Response) => {
            console.log('Hit on /observatory/api/products/:id');
            // TODO: Send product with id  
            res.send(req.params);
        })
        .put('/:id', (req: Request, res: Response) => {
            console.log('Hit on /observatory/api/products/:id');
            // TODO: Update product with id
        })
        
        
    }
}