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

    // requests not handled here
    // dispatched to appropriate files

    private config(): void {
        this.router
            // get all products
            .get('/', this.productController.getProduct)

            // create a new product
            .post('/', this.productController.addNewProduct)

            // get a specific product
            .get('/:id', this.productController.getProductWithID)

            // update a specific product
            .put('/:id', this.productController.updateProduct)

            // update only one field of a specific product
            .put('/:id', this.productController.partialUpdateProduct)
            
            // delete a specific product
            .delete(':id', this.productController.deleteProduct)
    }
}