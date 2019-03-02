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


        /* define the condition that will sort our
           products and return them the way the user 
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
