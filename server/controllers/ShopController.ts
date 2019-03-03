import * as mongoose from 'mongoose';
import {Shop} from '../models/ShopModel';
import * as express from 'express';
import { Int32 } from 'bson';
import { Price } from '../models/PriceModel';


type Request = express.Request;
type Response = express.Response;

export class ShopController {

    // add a new shop on database
    public addNewShop(req: Request, res: Response) {
        
        let newShop = new Shop(req.body);

        /* if all required fields were given then
           save new product to database, else throw
           error 400 : Bad Request */
        newShop.save((err, shop) => {
            if (err) {
                res.status(400).send({ message: "Bad Request" });
            }     
            res.json(shop);
        });
    }

    // get all shops (according to query) from database
    public getShop(req: Request, res: Response) {
        
        /* define the condition that will filter our
           shops and return those with the status
           the user requested */
        let condition = { withdrawn: false };

        switch( String(req.query.status )) { 
            case 'ALL': { 
                condition = undefined;
                break; 
            } 
            case 'WITHDRAWN': { 
                condition = { withdrawn: true };
                break; 
            } 
            case 'ACTIVE': { 
                condition = { withdrawn: false};
                break; 
            }
            default: { 
                condition = { withdrawn: false};
                break; 
            } 
        } 
        
        /* define the condition that will sort our
           shops and return them the way the user 
           requested */
           let sorting: any = { _id: -1 };

           switch( String(req.query.sort) ) { 
               case 'id|ASC': { 
                   sorting = { _id: 1 };
                   break; 
               } 
               case 'id|DESC': { 
                   sorting = { _id: -1 };
                   break; 
               } 
               case 'name|ASC': { 
                   sorting = { name: 1 };
                   break; 
               }
               case 'name|DESC': { 
                   sorting = { name: -1 };
                   break; 
               }
               default: { 
                   sorting = { _id: -1 };
                   break; 
               } 
           } 
   
           /* take start and count values if given
              else keep the default */
           let start = Number(req.query.start);
           let count = Number(req.query.count);
   
           if(!(req.query.start)){
               start = 0;
           }
           if(!(req.query.count)){
               count = 20;
           }
           
           /* sort shop list and define
              paging parameters */
           Shop.find( condition )
           .sort( sorting )
           .where('shops')
           .skip(start)
           .limit(count)
           .exec((err, shops) => {
            
                if (err) {
                    res.send(err);
                }
            
            /* determine the total number of shops
               returned */
            let total = shops.length;

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

        /* get key and value for the field that
           should be updated */
        let key = Object.keys(req.body)[0];
        let value = Object.values(req.body)[0];

        Shop.findByIdAndUpdate(
        { _id: req.originalUrl.slice(23)}, 
        { [key] : value }, { new: true },
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
        (err) => {
            if (err) {
                res.send(err);
            }
        });

        /* cascade on delete (delete all prices with the
           specific shop id) */
        Price.deleteMany({ shopId: req.originalUrl.slice(23)},
        (err) => {
            if (err) {
                res.send(err);
            }
            res.status(200).send(
                {message : "OK"}
            );
        });
    }
}
