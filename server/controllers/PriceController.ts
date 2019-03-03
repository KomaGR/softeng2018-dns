import * as mongoose from 'mongoose';
import { Price } from '../models/PriceModel';
import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}


export class PriceController {

    public addNewPrice(req: Request, res: Response) {

        let endDate = new Date(req.body.dateTo);
        let referenceDate = new Date(req.body.dateFrom);
        console.log(referenceDate);
        console.log(endDate);

        // delete req.body.dateFrom;
        // delete req.body.dateTo;

        let diff = dateDiffInDays(referenceDate, endDate);
        if (diff < 0) {
            res.status(400).send({ message: "Bad Request" });
        }
        var pricestable = [];

        for (let i = 0; i <= diff; i++) {
            req.body.date = new Date(referenceDate);
            referenceDate.setDate(referenceDate.getDate()+1);

            let newPrice = new Price(req.body);
            console.log(req.body);

            newPrice.save((err, price) => {
                if (err) {
                    res.send(err);
                }
                // res.json(price);
                console.log(price);

                pricestable[i] = price;

                console.log(pricestable);
                if (i == diff) res.send(pricestable);
            });
        }
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
