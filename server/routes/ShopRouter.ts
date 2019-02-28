import * as express from 'express';
import { ShopController } from '../controllers/ShopController';

type Request = express.Request;
type Response = express.Response;

/*  Note:   This class is subject to later abstraction via passing
            {method, path, callee} vectors. Hence the warning 
            below.
*/
export default class {

    public router: express.Router;
    public shopController: ShopController = new ShopController();

    constructor() {
        this.router = express.Router();
        this.config();
    }

    // requests not handled here
    // dispatched to appropriate files
    
    private config(): void {
        this.router

            // get all shops
            .get('/', this.shopController.getShop)

            // create a new shop
            .post('/', this.shopController.addNewShop)

            // get a specific shop
            .get('/:id', this.shopController.getShopWithID)

            // update a specific shop
            .put('/:id', this.shopController.updateShop)
      
            // update only one field of a specific shop
            .put('/:id', this.shopController.partialUpdateShop)
            
            // delete a specific shop
            .delete(':id', this.shopController.deleteShop)
    }
}