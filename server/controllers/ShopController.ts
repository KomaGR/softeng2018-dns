import * as mongoose from 'mongoose';
import * as ShopModel from '../models/ShopModel';
import * as express from 'express';
import { Int32 } from 'bson';
import { Price } from './PriceController';


type Request = express.Request;
type Response = express.Response;

const Shop = mongoose.model('Shop', ShopModel.ShopSchema);


export class ShopController {

    // add a new shop on database
    public addNewShop(req: Request, res: Response) {
        let newShop = new Shop(req.body);

        newShop.save((err, shop) => {
            if (err) {
                res.send(err);
            }
            res.json(shop);
        });
    }

    // get all shops (according to query) from database
    public getShop(req: Request, res: Response) {
        Shop.find({}, (err, shoplist) => {
            if (err) {
                res.send(err);
            }
            
            let start = Number(Object.values(req.query)[0]);
            let count = Number(Object.values(req.query)[1]);
            let total = shoplist.length;
            let shops = shoplist.slice(start, (start+count))

            res.status(200).send({
                start,
                count,
                total,
                shops
            });
        });
    }

    // get a specific shop from database
    public getShopWithID(req: Request, res: Response) {
        Shop.findById(
            { _id: req.originalUrl.slice(23)}, 
            (err, shop) => {
                if (err) {
                    res.send(err);
                }
            res.json(shop);
        });
    }

    // update a specific shop on database
    public updateShop(req: Request, res: Response) {
        Shop.findOneAndUpdate(
            { _id: req.originalUrl.slice(23)}, 
            req.body, { new: true },
            (err, shop) => {
                if (err) {
                    res.send(err);
                }
            res.json(shop);
        });
    }

    // update only one field of a specific shop on database
    public partialUpdateShop(req: Request, res: Response) {
        Shop.findOneAndUpdate(
            { _id: req.originalUrl.slice(23)}, 
            req.body, { new: true },
            (err, shop) => {
                if (err) {
                    res.send(err);
                }
            res.json(shop);
        });
    }

    // delete a specific shop from database
    public deleteShop(req: Request, res: Response) {
        Shop.deleteOne(
            { _id: req.originalUrl.slice(23)},
            (err:any) => {
                if (err) {
                    res.send(err);
                }
                Price.deleteMany({ shopId: req.originalUrl.slice(26)},
                    (err) => {
                        if (err) {
                            res.send(err);
                        }
                    });
                res.json({ message: 'OK' });
            }
        );
    }


}
