import * as express from 'express';
import { ProductController } from '../controllers/ProductController';

type Request = express.Request;
type Response = express.Response;

/*  Note:   This class is subject to later abstraction via passing
            {method, path, callee} vectors. Hence the warning 
            below.
*/
export default class {
    
    public router: express.Router;
    public productController: ProductController = new ProductController();

    constructor() {
        this.router = express.Router();
        this.config();
    }

    // WARNING: DO NOT HANDLE REQUESTS HERE! DISPATCH THEM
    //          TO APPROPRIATE FILES.
    private config(): void {
        this.router
            // Get all products
            .get('/', this.productController.getMockProduct)
            // .get('/', (req: Request, res: Response) => {
            //     console.log("Hit on /observatory/api/products");
            //     // TODO: Send all products
            //     res.status(200).send("NotImplementedError");
            // })
            //Create a new product
            .post('/', this.productController.addNewProduct)

            // .post('/', (req: Request, res: Response) => {
            //     console.log("Hit on /observatory/api/products");
            //     // TODO: Register new product
            //     res.status(200).send("NotImplementedError");
            // })
            // get a specific contact
            .get('/:id', this.productController.getMockProductWithID)
            // .get('/:id', (req: Request, res: Response) => {
            //     console.log('Hit on /observatory/api/products/:id');
            //     // TODO: Send product with id  
            //     res.status(200).send("NotImplementedError");
            //     // res.send(req.params);
            // })
            // update a specific contact
            .put('/:id', this.productController.updateProduct)
            // .put('/:id', (req: Request, res: Response) => {
            //     console.log('Hit on /observatory/api/products/:id');
            //     // TODO: Update product with id
            //     res.status(200).send("NotImplementedError");
            // })
            .delete(':id', this.productController.updateProduct)
            // .delete('/:id', (req: Request, res: Response) => {
            //     console.log('Hit on /observatory/api/products/:id');
            //     // TODO: Delete product with id
            //     res.status(200).send("NotImplementedError");
            // })
        
        
    }
}