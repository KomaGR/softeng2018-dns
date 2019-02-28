import * as mongoose from 'mongoose';
import * as ProductModel from '../models/ProductModel';
import * as express from 'express';

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
        Product.find({}, (err, product) => {
            if (err) {
                res.send(err);
            }
            res.json(product);
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

    // delete a specific product from database
    public deleteProduct(req: Request, res: Response) {
        Product.findOneAndDelete(
            { _id: req.originalUrl.slice(26)},
            (err:any) => {
            if (err) {
                res.send(err);
            }
            res.json({ message: 'Successfully deleted product!' });
        });
    }


}
