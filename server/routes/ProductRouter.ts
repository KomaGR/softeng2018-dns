import * as express from 'express';
import { ProductController } from '../controllers/ProductController';
import { bounceStrangers } from "./bouncer";

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
            .post('/', bounceStrangers ,this.productController.addNewProduct)

            // get a specific product
            .get('/:id', this.productController.getProductWithID)

            // update a specific product
            .put('/:id', bounceStrangers, this.productController.updateProduct)

            // update only one field of a specific product
            .patch('/:id', bounceStrangers, this.productController.partialUpdateProduct)
            
            // delete a specific product
            .delete('/:id', bounceStrangers, this.productController.deleteProduct)
    }

}