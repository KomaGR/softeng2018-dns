import * as mongoose from 'mongoose';
import * as PriceModel from '../models/PriceModel';
import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

const Price = mongoose.model('Price', PriceModel.PriceSchema);

export class PriceController {

    // add a new price on database
    public addNewPrice(req: Request, res: Response) {
        let newPrice = new Price(req.body);

        newPrice.save((err, price) => {
            if (err) {
                res.send(err);
            }
            res.json(price);
        });
    }

    // get all prices (according to query) from database
    public getPrice(req: Request, res: Response) {
        Price.find({}, (err, price) => {
            if (err) {
                res.send(err);
            }
            res.json(price);
        });
    }

      public getPriceWithID(req: Request, res: Response) {
        Price.findById(
            { _id: req.params.priceId },
            (err, price) => {
                if (err) {
                    res.send(err);
                }
                res.json(price);
            });
    }

    public updatePrice(req: Request, res: Response) {
        Price.findOneAndUpdate(
            { _id: req.params.priceId },
            req.body, { new: true }, (err, price) => {
                if (err) {
                    res.send(err);
                }
                res.json(price);
            });
    }

    public deletePrice(req: Request, res: Response) {
        Price.remove(
            { _id: req.params.priceId },
            (err: any) => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Successfully deleted price!' });
            });
    }


}