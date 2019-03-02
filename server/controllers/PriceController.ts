import * as mongoose from 'mongoose';
import * as PriceModel from '../models/PriceModel';
import * as express from 'express';
let DateDiff = require('date-diff');

type Request = express.Request;
type Response = express.Response;

export const Price = mongoose.model('Price', PriceModel.PriceSchema);

export class PriceController {

    public addNewPrice(req: Request, res: Response) {
        let date1 = new Date(req.body.dateFrom);
        let date2 = new Date(req.body.dateTo);

        let diff = new DateDiff(date2, date1);
        let from = date1;

        console.log(diff.days(), typeof (diff.days()));

        for (let i = 0; i <= diff.days(); i++) {
            req.body.dateTo = i+1;
            let newPrice = new Price(req.body);

            newPrice.save((err, price) => {
                if (err) {
                    res.send(err);
                }
                // res.json(price);
            });
        }
        res.sendStatus(200)

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
            { id: req.params.priceId },
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