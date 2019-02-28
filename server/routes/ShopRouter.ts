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

    // WARNING: DO NOT HANDLE REQUESTS HERE! DISPATCH THEM
    //          TO APPROPRIATE FILES.
    private config(): void {
        this.router
            // Get all shops
            .get('/', this.shopController.getShop)

            //Create a new shop
            .post('/', this.shopController.addNewShop)

            // get a specific contact
            .get('/:id', this.shopController.getShopWithID)

            // update a specific contact
            .put('/:id', this.shopController.updateShop)

            .delete(':id', this.shopController.updateShop)

    }
}