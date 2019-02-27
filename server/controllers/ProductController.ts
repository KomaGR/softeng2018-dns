import * as mongoose from 'mongoose';
import * as ProductModel from '../models/ProductModel';
import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

const Product = mongoose.model('Product', ProductModel.ProductSchema);

export class ProductController {

    public addNewProduct(req: Request, res: Response) {
        let newProduct = new Product(req.body);

        newProduct.save((err, product) => {
            if (err) {
                res.send(err);
            }
            res.json(product);
        });
    }

    public getProduct(req: Request, res: Response) {
        Product.find({}, (err, product) => {
            if (err) {
                res.send(err);
            }
            res.json(product);
        });
    }

    public getProductWithID(req: Request, res: Response) {
        Product.findById(
            { _id: req.params.productId }, 
            (err, product) => {
            if (err) {
                res.send(err);
            }
            res.json(product);
        });
    }

    public updateProduct(req: Request, res: Response) {
        Product.findOneAndUpdate(
            { _id: req.params.productId }, 
            req.body, { new: true }, (err, product) => {
            if (err) {
                res.send(err);
            }
            res.json(product);
        });
    }

    public deleteProduct(req: Request, res: Response) {
        Product.remove(
            { _id: req.params.productId }, 
            (err:any) => {
                if (err) {
                    res.send(err);
                }
            res.json({ message: 'Successfully deleted product!' });
        });
    }


}
