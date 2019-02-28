import * as mongoose from 'mongoose';
import * as ShopModel from '../models/ShopModel';
import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

const Shop = mongoose.model('Shop', ShopModel.ShopSchema);

export class ShopController {

    public addNewShop(req: Request, res: Response) {
        let newShop = new Shop(req.body);

        newShop.save((err, shop) => {
            if (err) {
                res.send(err);
            }
            res.json(shop);
        });
    }

    public getShop(req: Request, res: Response) {
        Shop.find({}, (err, shop) => {
            if (err) {
                res.send(err);
            }
            res.json(shop);
        });
    }

    public getShopWithID(req: Request, res: Response) {
        Shop.findById(req.params.shopId, (err, shop) => {
            if (err) {
                res.send(err);
            }
            res.json(shop);
        });
    }

    public updateShop(req: Request, res: Response) {
        Shop.findOneAndUpdate({ _id: req.params.shopId }, req.body, { new: true }, (err, shop) => {
            if (err) {
                res.send(err);
            }
            res.json(shop);
        });
    }

    public partialUpdateShop(req: Request, res: Response) {
        Shop.findOneAndUpdate({ _id: req.params.shopId }, req.body, { new: true }, (err, shop) => {
            if (err) {
                res.send(err);
            }
            res.json(shop);
        });
    }

    public deleteShop(req: Request, res: Response) {
        Shop.remove(
            { _id: req.params.shopId },
            (err: any) => {
                if (err) {
                    res.send(err);
                }
                res.json({ message: 'Successfully deleted shop!' });
            });
    }


}
