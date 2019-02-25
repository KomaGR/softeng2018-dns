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
            // .get('/', (req: Request, res: Response) => {
            //     console.log("Hit on /observatory/api/shops");
            //     // TODO: Send all shops
            //     res.status(200).send("NotImplementedError");
            // })
            //Create a new shop
            .post('/', this.shopController.addNewShop)

            // .post('/', (req: Request, res: Response) => {
            //     console.log("Hit on /observatory/api/shops");
            //     // TODO: Register new shop
            //     res.status(200).send("NotImplementedError");
            // })
            // get a specific contact
            .get('/:id', this.shopController.getShopWithID)
            // .get('/:id', (req: Request, res: Response) => {
            //     console.log('Hit on /observatory/api/shops/:id');
            //     // TODO: Send shop with id  
            //     res.status(200).send("NotImplementedError");
            //     // res.send(req.params);
            // })
            // update a specific contact
            .put('/:id', this.shopController.updateShop)
            // .put('/:id', (req: Request, res: Response) => {
            //     console.log('Hit on /observatory/api/shops/:id');
            //     // TODO: Update shop with id
            //     res.status(200).send("NotImplementedError");
            // })
            .delete(':id', this.shopController.updateShop)
        // .delete('/:id', (req: Request, res: Response) => {
        //     console.log('Hit on /observatory/api/shops/:id');
        //     // TODO: Delete shop with id
        //     res.status(200).send("NotImplementedError");
        // })


    }
}