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

            //Create a new product
            .post('/', this.productController.addNewProduct)

            // get a specific contact
            .get('/:id', this.productController.getMockProductWithID)

            // update a specific contact
            .put('/:id', this.productController.updateProduct)

            .delete(':id', this.productController.updateProduct)  
        
    }
}