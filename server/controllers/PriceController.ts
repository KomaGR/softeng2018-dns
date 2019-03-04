import * as mongoose from 'mongoose';
import { Price } from '../models/PriceModel';
import * as express from 'express';
import { Shop } from '../models/ShopModel';
import { json } from 'body-parser';
import { ShopController } from './ShopController';
import { Db } from 'mongodb';
import { Product } from '../models/ProductModel';
import { equal } from 'assert';

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

        let start: number;
        let count: number;

        if(!(req.query.start)){
            start = 0;
        }
        else {

            /* check if start parameter given, is type Int and also
            if it is greater or equal to zero */
            if ( !(Number.isInteger(Number(req.query.start))) || 
            Number(req.query.start) < 0 ){
                res.status(400).send({ message: "Bad Request" });
            }

            start = Number(req.query.start);

        }
        
        if(!(req.query.count)){
            count = 20;
        }
        else {
        
            /* check if count parameter given, is type Int and also
            if it is greater or equal to zero */
            if ( !(Number.isInteger(Number(req.query.count))) ||
            Number(req.query.count) < 0 ){
                res.status(400).send({ message: "Bad Request" });
            }

            count = Number(req.query.count);        

        }


        let shopIdList: any;

        // check that either all or none of the geo-parameters were defined
        if( !( req.query.geoLng && req.query.geoLat && req.query.geoDist ) ) {
            if( !( !req.query.geoLng && !req.query.geoLat && !req.query.geoDist ) ) {
                // case some of the geo-parameters are defined and some are undefined
                res.status(400).send({ message: "Bad Request" });
            }
            else {  // case none of the geo-parameters are defined

                /* List of Shop ids we are intrested in, in case
                none of the geo-parameters are defined */
                shopIdList =
                Shop.find({ shopId: { $in: req.query.products } },
                { _id: 1 },
                ( err , shopIdList ) => {
                    if (err) {
                        res.send(err);
                    }
                });
            }
        }
        else {  // case all of the geo-parameters are defined

            /* check if geoDist is Int and geoLng, geoLat are Double and
            also if geoDist is greater or equal to zero */
            if ( !(Number.isInteger(Number(req.query.geoDist))) ||
            Number(req.query.geoDist) < 0 ){
                res.status(400).send({ message: "Bad Request" });
            }
            if ( !( Number(req.query.geoLng ) ) ) {
                res.status(400).send({ message: "Bad Request" });
            }
    
            if ( !( Number(req.query.geoLat ) ) ) {
                res.status(400).send({ message: "Bad Request" });
            }

            /* List of Shop ids we are intrested in, in case
            all geo-parameters are defined */
            shopIdList =
            Shop.find({$and:[
                {_id: { $in: req.query.shops } },
                {
                    location: {
                        $near: {
                            $geometry: {
                                type: "Point",
                                coordinates: [parseFloat(req.query.geoLng), parseFloat(req.query.geoLat)]
                            },
                            $maxDistance: 1000*parseFloat(req.query.geoDist)
                        }
                    }
                }
            ]},
            { _id: 1 },
            ( err , shopIdList ) => {
                if (err) {
                    res.send(err);
                }
            });
        }


        // List of Product ids we are intrested in
        let productIdList =
        Product.find({ productId: { $in: req.query.products } },
        { _id: 1 },
        ( err , productIdList) => {
            if (err) {
                res.send(err);
            }
        });


        // check that either none or both of the date-parameters were defined
        if( req.query.dateFrom ? !( req.query.dateTo ) : req.query.dateTo ) {
            res.status(400).send({ message: "Bad Request" });
        }

        // check if date-parameters are of type date
        if ( !( req.query.dateFrom instanceof Date ) ) {
            res.status(400).send({ message: "Bad Request" });
        }
        if ( !( req.query.dateTo instanceof Date ) ) {
            res.status(400).send({ message: "Bad Request" });
        }


        /* List of Product ids that include at least one 
        of the tags we are intrested in */
        let productIdListByTag =
        Product.find( { tags: { $elemMatch: { $in: req.query.tags } } },
        { _id: 1},
        ( err , productIdListByTag ) => {
            if (err) {
                res.send(err);
            }
        });


        /* List of Shop ids that include at least one 
        of the tags we are intrested in */
        let shopIdListByTag =
        Shop.find( { tags: { $elemMatch: { $in: req.query.tags } } },
        { _id: 1},
        ( err , shopIdListByTag ) => {
            if (err) {
                res.send(err);
            }
        });


        // Query to get prices as described in restAPI specifications
        let prices =
        Price.find({ $and: [
                   { date: { $gte: req.query.dateFrom , $lte: req.query.dateTo } },
                   { productId: { $in: productIdList } },
                   { shopId: { $in: shopIdList } },
                   { $or: [
                          { productId: { $in: productIdListByTag } },
                          { shopId: { $in: shopIdListByTag } }
                   ]}
                   ]},
        ( err , prices ) => {
            if (err) {
                res.send(err);
            }
            res.json(prices);
        });

        // console.log(prices);
        

        // determine the total number of shops returned
        // let total = prices.length;
        



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
