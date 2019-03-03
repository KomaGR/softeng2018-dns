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

        /* check query's format. Only acceptable format is json.
        We also accept queries with the format field undefined
        Any query with format value defined with value different
        from json is not accepted. */
        if( req.query.format != 'json' && req.query.format ) {
            return(res.status(400).send({ message: "Bad Request" })); 
        }

        if (!(Number(req.body.lng)) ||
        !(Number(req.body.lat)) ){
            return(res.status(400).send({ message: "Bad Request" })); 
        }
        
        let newShop = new Shop(req.body);

        /* if all required fields were given then
        save new product to database, else throw
        error 400 : Bad Request */
        newShop.save((err, shop) => {
            if (err && err.name === 'ValidatorError') {
                res.status(400).send({ message: "Bad Request" });
            }
            else if (err) {
                res.json(err);
            }   
            res.json(shop);
        });
    }

    // get all shops (according to query) from database
    public getShop(req: Request, res: Response) {

        /* check query's format. Only acceptable format is json.
        We also accept queries with the format field undefined
        Any query with format value defined with value different
        from json is not accepted. */
        if( req.query.format != 'json' && req.query.format ) {
            return(res.status(400).send({ message: "Bad Request" })); 
        }
        
        let condition: any;

        if( !(req.query.status)) {
            condition = { withdrawn: false };
        }
        else {

            /* check if value given belongs to the set
            of acceptable values */
            if((String(req.query.status) != 'ALL') &&
            (String(req.query.status) != 'ACTIVE') &&
            (String(req.query.status) != 'WITHDRAWN') ){
                    return(res.status(400).send({ message: "Bad Request" }));
            }

            /* define the condition that will filter our
            shops and return those with the status
            the user requested */
            switch( String(req.query.status) ) { 
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
        }
        
        let sorting: any;

        if( !(req.query.sort)) {
            sorting = { _id: -1 };
        }
        else{

            /* check if value given belongs to the set
            of acceptable values */
            if((String(req.query.sort) != 'id|ASC') &&
            (String(req.query.sort) != 'id|DESC') &&
            (String(req.query.sort) != 'name|ASC') &&
            (String(req.query.sort) != 'name|DESC') ){
                    return(res.status(400).send({ message: "Bad Request" }));
            }

            /* define the condition that will sort our
            shops and return them the way the user 
            requested */
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
                    sorting = { name: -1 };
                    break;
                }
            }
        }

        let start: number;
        let count: number;

        if(!(req.query.start)){
            start = 0;
        }
        else {

            // check if start parameter given, are type: Int
            if ( !(Number.isInteger(Number(req.query.start))) || 
            Number(req.query.start) <= 0 ){
                return(res.status(400).send({ message: "Bad Request" }));
            }

            start = Number(req.query.start);

        }
        
        if(!(req.query.count)){
            count = 20;
        }
        else {
        
            // check if start parameter given, are type: Int
            if ( !(Number.isInteger(Number(req.query.count))) ||
            Number(req.query.count) <= 0 ){
                return(res.status(400).send({ message: "Bad Request" }));
            }

            count = Number(req.query.count);        

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

        /* check query's format. Only acceptable format is json.
        We also accept queries with the format field undefined
        Any query with format value defined with value different
        from json is not accepted. */
        if( req.query.format != 'json' && req.query.format ) {
            return(res.status(400).send({ message: "Bad Request" })); 
        }

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

        /* check query's format. Only acceptable format is json.
        We also accept queries with the format field undefined
        Any query with format value defined with value different
        from json is not accepted. */
        if( req.query.format != 'json' && req.query.format ) {
            return(res.status(400).send({ message: "Bad Request" })); 
        }
        
        // check that the user passed all fields of shop entity (correctly)
        if ( !(req.body.name) ||
        !(req.body.address) ||
        !(req.body.lng) ||
        !(req.body.lat) ||
        !(req.body.tags) ||
        !(Number(req.body.lng)) ||
        !(Number(req.body.lat)) ){
            return(res.status(400).send({ message: "Bad Request" })); 
        }

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

        /* check query's format. Only acceptable format is json.
        We also accept queries with the format field undefined
        Any query with format value defined with value different
        from json is not accepted. */
        if( req.query.format != 'json' && req.query.format ) {
            return(res.status(400).send({ message: "Bad Request" })); 
        }

        // check that user passes exactly one entry
        if ( Object.entries(req.body).length != 1) {
            return(res.status(400).send({ message: "Bad Request" })); 
        }

        /* check that the entry given, is one of the
        entries of shop entity */
        if ( (!(req.body.name) &&
        !(req.body.address) &&
        !(req.body.lng) &&
        !(req.body.lat) &&
        !(req.body.tags) ) ||
        (( req.body.lng && !(Number(req.body.lng)))) ||
        (( req.body.lat && !(Number(req.body.lat)))) ){
            return(res.status(400).send({ message: "Bad Request" })); 
        }

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

        /* check query's format. Only acceptable format is json.
        We also accept queries with the format field undefined
        Any query with format value defined with value different
        from json is not accepted. */
        if( req.query.format != 'json' && req.query.format ) {
            return(res.status(400).send({ message: "Bad Request" })); 
        }

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
