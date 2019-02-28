import * as mongoose from 'mongoose';
import * as PriceModel from '../models/PriceModel';
import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

const Price = mongoose.model('Price', PriceModel.PriceSchema);

export class PriceController {

    public addNewPrice(req: Request, res: Response) {
        let newPrice = new Price(req.body);

        newPrice.save((err, price) => {
            if (err) {
                res.send(err);
            }
            res.json(price);
        });
    }

    public getPrice(req: Request, res: Response) {
        Price.find({}, (err, price) => {
            if (err) {
                res.send(err);
            }
            res.json(price);
        });
    }

}
 