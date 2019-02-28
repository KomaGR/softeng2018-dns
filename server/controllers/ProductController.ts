import * as mongoose from 'mongoose';
import * as ProductModel from '../models/ProductModel';
import * as express from 'express';

type Request = express.Request;
type Response = express.Response;

const Product = mongoose.model('Product', ProductModel.ProductSchema);
const mockProduct = {
    id: "123748",
    name: "AMD i5",
    description: "Best cpu ever",
    category: "CPU",
    tags: ["computing", "hardware"],
    withdrawn: false,
    extraData: {
        speed: "8.33 GHz",
        cores: "42"
    }
}

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

    // Mock method
    public getMockProduct(req: Request, res: Response) {
        res.status(200).send({
            start: 0,
            count: 3,
            total: 3,
            products: [
                mockProduct,
                mockProduct,
                mockProduct
            ]
        });
    }

    // Mock method
    public getMockProductWithID(req: Request, res: Response) {
        res.status(200).send(mockProduct);
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

    public partialUpdateProduct(req: Request, res: Response) {
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
