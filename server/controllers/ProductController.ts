import * as mongoose from 'mongoose';
import {Product} from '../models/ProductModel';
import * as express from 'express';
import { Price } from '../models/PriceModel';
import { Int32 } from 'bson';


type Request = express.Request;
type Response = express.Response;

export class ProductController {

    // add a new product on database
    public addNewProduct(req: Request, res: Response) {  

        let newProduct: any = new Product(req.body);        

        /* if all required fields were given then
        save new product to database, else throw
        error 400 : Bad Request */
        newProduct.save((err, product) => {
            if (err && err.name === 'ValidatorError') {
                res.status(400).send({ message: "Bad Request" });
            }
            else if (err) {
                res.json(err);
            }
            res.json(product);
        });
    }

    // get all products (according to query) from database
    public getProduct(req: Request, res: Response) {
       
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
            products and return those with the status
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
            products and return them the way the user 
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

        /* sort product list and define
        paging parameters */
        Product.find( condition )
        .sort( sorting )
        .where('products')
        .skip(start)
        .limit(count)
        .exec((err, products) => {
            if (err) {
                res.send(err);
            }

            /* determine the total number of products
            returned */
            let total = products.length;

            res.status(200).send({
                start,
                count,
                total,
                products
            });
        });

    }

    // get a specific product from database
    public getProductWithID(req: Request, res: Response) {
                
        Product.findById(
        { _id: req.originalUrl.slice(26)}, 
        (err, product) => {
            if (err) {
                res.send(err);
            }
            res.json(product);
        });
    }

    // update a specific product on database
    public updateProduct(req: Request, res: Response) {
        Product.findOneAndUpdate(
        { _id: req.originalUrl.slice(26)}, 
        req.body, { new: true },
        (err, product) => {
            if (err) {
                res.send(err);
            }
            res.json(product);
        });
    }
    
    // update only one field of a specific product on database
    public partialUpdateProduct(req: Request, res: Response) {

        /* get key and value for the field that
        should be updated */
        let key = Object.keys(req.body)[0];
        let value = Object.values(req.body)[0];

        Product.findByIdAndUpdate(
        { _id: req.originalUrl.slice(26)}, 
        { [key] : value }, { new: true },
        (err, product) => {
            if (err) {
                res.send(err);
            }
            res.json(product);
        });
    }

    // delete a specific product from database
    public deleteProduct(req: Request, res: Response) {
        Product.deleteOne(
        { _id: req.originalUrl.slice(26)},
        (err) => {
            if (err) {
                res.send(err);
            }
        });

        /* cascade on delete (delete all prices with the
        specific product id) */
        Price.deleteMany({ productId: req.originalUrl.slice(26)},
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
