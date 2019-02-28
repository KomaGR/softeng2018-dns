import * as express from 'express';
import { PriceController } from '../controllers/PriceController';

type Request = express.Request;
type Response = express.Response;

/*  Note:   This class is subject to later abstraction via passing
            {method, path, callee} vectors. Hence the warning 
            below.
*/
export default class {

    public router: express.Router;
    public priceController: PriceController = new PriceController();

    constructor() {
        this.router = express.Router();
        this.config();
    }

    // WARNING: DO NOT HANDLE REQUESTS HERE! DISPATCH THEM
    //          TO APPROPRIATE FILES.
    private config(): void {
        this.router
            // Get all prices
            .get('/', this.priceController.getPrice)

            //Create a new Price
            .post('/', this.priceController.addNewPrice)

            // get a specific Price
            .get('/:id', this.priceController.getPriceWithID)

            // update a specific Price
            .put('/:id', this.priceController.updatePrice)

            // delete a specific Price
            .delete(':id', this.priceController.updatePrice)

    }
}