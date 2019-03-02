import * as mongoose from 'mongoose';
import * as ProductModel from '../models/ProductModel';
import * as express from 'express';
import { Price } from './PriceController';


type Request = express.Request;
type Response = express.Response;

const Product = mongoose.model('Product', ProductModel.ProductSchema);


export class ProductController {

    // add a new product on database
    public addNewProduct(req: Request, res: Response) {
        
        let newProduct = new Product(req.body);        

        newProduct.save((err, product) => {
            if (err) {
                res.send(err);
            }            
            res.json(product);
        });
    }

    // get all products (according to query) from database
    public getProduct(req: Request, res: Response) {
       
        /* define the condition that will filter our
           products and return those with the status
           the user requested */
        let condition = { withdrawn: false };

        switch( String(Object.values(req.query)[2]) ) { 
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
           
        Product.find( condition,
        (err, productlist) => {
            if (err) {
                res.send(err);
            }

            /* determine the total number of products and the
               list products returned */
            let start = Number(Object.values(req.query)[0]);
            let count = Number(Object.values(req.query)[1]);
            let total = productlist.length;
            let products = productlist.slice(start, (start+count))

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
