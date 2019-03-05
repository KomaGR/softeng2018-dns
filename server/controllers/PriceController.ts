import * as mongoose from 'mongoose';
import { Price } from '../models/PriceModel';
import * as express from 'express';
import { Shop } from '../models/ShopModel';
import { Product } from '../models/ProductModel';
import pricesort from './pricesort';

var Schema = mongoose.Schema;

type Request = express.Request;
type Response = express.Response;

const _MS_PER_DAY = 1000 * 60 * 60 * 24;

// a and b are javascript Date objects
function dateDiffInDays(a, b) {
    // Discard the time and time-zone information.
    const utc1 = Date.UTC(a.getFullYear(), a.getMonth(), a.getDate());
    const utc2 = Date.UTC(b.getFullYear(), b.getMonth(), b.getDate());

    return Math.floor((utc2 - utc1) / _MS_PER_DAY);
}




function flatten(prices, inputLng, inputLat) {
    
    return prices;
}


export class PriceController {

    public addNewPrice(req: Request, res: Response) {

        let endDate = new Date(req.body.dateTo);
        let referenceDate = new Date(req.body.dateFrom);

        let diff = dateDiffInDays(referenceDate, endDate);
        if (diff < 0) {
            return(res.status(400).send({ message: "Bad Request" }));
        }
        var pricestable = [];

        for (let i = 0; i <= diff; i++) {
            req.body.date = new Date(referenceDate);
            referenceDate.setDate(referenceDate.getDate()+1);

            let newPrice = new Price(req.body);

            newPrice.save((err, price) => {
                if (err) {
                    res.send(err);
                }
                else {

                    pricestable[i] = price;

                    if (i == diff) {res.status(201).send(pricestable)};
                }
            });
        }
    }

    // get all prices (according to query) from database
    public getPrice(req: Request, res: Response) {

        let start: number;
        let count: number;

        // console.log(`Start: ${req.query.start} - Count: ${req.query.count} - 
        // geoDist: ${req.query.geoDist} - geoLng: ${req.query.lng} - geoLat: ${req.query.lat} - 
        // dateFrom: ${req.query.dateFrom} - dateTo: ${req.query.dateTo} - shops: ${req.query.shops} -
        // products: ${req.query.products} - tags: ${req.query.tags} - sort: ${req.query.sort}`)

        if(!(req.query.start)){
            start = 0;
        }
        else {

            /* check if start parameter given, is type Int and also
            if it is greater or equal to zero */
            if ( !(Number.isInteger(Number(req.query.start))) || 
            Number(req.query.start) < 0 ){
                return(res.status(400).send({ message: "Bad Request" }));
            }

            start = Number(req.query.start);

        }
        
        if(!(req.query.count)){
            count = 20;
        }
        else {
        
            /* check if count parameter given, is type Int and also
            if it is greater or equal to zero */
            if ( !(Number.isInteger(Number(req.query.count))) ||
            Number(req.query.count) < 0 ){
                return(res.status(400).send({ message: "Bad Request" }));
            }

            count = Number(req.query.count);        

        }

        let sorting: any = {};

        if( !(req.query.sort)) {
            sorting.price = 1;
        }
        else{
            for(var sortfilter in req.query.sort) {

            /* check if value given belongs to the set
            of acceptable values */
            // if(sortfilter != 'price|ASC' &&
            //    sortfilter != 'price|DESC' &&
            //    sortfilter != 'date|ASC' &&
            //    sortfilter != 'date|DESC' &&
            //    sortfilter != 'geoDist|ASC' &&
            //    sortfilter != 'geoDist|DESC' ){
            //         return(res.status(400).send({ message: "Bad Request" }));
            // }

            /* define the condition that will sort our
            products and return them the way the user 
            requested */
            // switch( String(req.query.sort) ) {
            //     case 'price|ASC': {
            //         sorting.price = 1;
            //         break;
            //     }
            //     case 'price|DESC': {
            //         sorting.price = -1;
            //         break;
            //     }
            //     case 'date|ASC': {
            //         sorting.date = 1;
            //         break;
            //     }
            //     case 'date|DESC': {
            //         sorting.date = -1;
            //         break;
            //     }
            //     case 'geoDist|ASC': {
            //         sorting.geoDist = 1;
            //         break;
            //     }
            //     case 'geoDist|DESC': {
            //         sorting.geoDist = -1;
            //         break;
            //     }
            //     default: {
            //         return(res.status(400).send({ message: "Bad Request" }));
            //         break;
            //     }
            // }
        }
    }

        // check that either none or both of the date-parameters were defined
        if (req.query.dateFrom ? ! req.query.dateTo : req.query.dateTo ) {
            return(res.status(400).send({ message: "Bad Request" }));
        }
        else if ( ! req.query.dateFrom && ! req.query.dateTo) {
            let today = new Date();
            req.query.dateFrom = req.query.dateTo = today.toISOString().slice(0, 10);
        }
        else if ( req.query.dateFrom > req.query.dateTo ) {
            return(res.status(400).send({ message: "Bad Request" }));
        }

        let shopConditions: any = {};


        if( req.query.shops ) {
            shopConditions._id = { $in: req.query.shops };
        }        

        let shopIdList: mongoose.DocumentQuery<mongoose.MongooseDocument[],
        mongoose.Document, {}>;

        // check that either all or none of the geo-parameters were defined
        if( !( req.query.geoLng && req.query.geoLat && req.query.geoDist ) ) {
            if( !( !req.query.geoLng && !req.query.geoLat && !req.query.geoDist ) ) {
                // case some of the geo-parameters are defined and some are undefined
                return(res.status(400).send({ message: "Bad Request" }));
            }
        }
        else {  // case all of the geo-parameters are defined

            /* check if geoDist is Int and geoLng, geoLat are Double and
            also if geoDist is greater or equal to zero */
            if ( !(Number.isInteger(Number(req.query.geoDist))) ||
            Number(req.query.geoDist) < 0 ){
                return(res.status(400).send({ message: "Bad Request" }));
            }
            if ( !( Number(req.query.geoLng ) ) ) {
                return(res.status(400).send({ message: "Bad Request" }));
            }
    
            if ( !( Number(req.query.geoLat ) ) ) {
                return(res.status(400).send({ message: "Bad Request" }));
            }

            shopConditions.location = {
                $near: {
                    $geometry: {
                        type: "Point",
                        coordinates: [parseFloat(req.query.geoLng), parseFloat(req.query.geoLat)]
                    },
                    $maxDistance: 1000*parseFloat(req.query.geoDist)
                }
            };
        }

        // List of Shop ids we are intrested in
        shopIdList =
        Shop.find(shopConditions,
        { _id: 1 });

        let productConditions: any = {};

        if ( req.query.products ) {
            productConditions._id = { $in: req.query.products }
        };        

        // List of Product ids we are intrested in
        let productIdList: mongoose.DocumentQuery<mongoose.MongooseDocument[],
        mongoose.Document, {}> =
        Product.find( productConditions ,
        { _id: 1 });


        let productByTagConditions: any = {};

        if ( req.query.tags ) {
            productByTagConditions.tags = { $elemMatch: { $in: req.query.tags } };
        };

        /* List of Product ids that include at least one 
        of the tags we are intrested in */
        let productIdListByTag: mongoose.DocumentQuery<mongoose.MongooseDocument[],
        mongoose.Document, {}> =
        Product.find( productByTagConditions,
        { _id: 1});


        let shopByTagConditions: any = {};

        if ( req.query.tags ) {
            shopByTagConditions.tags = { $elemMatch: { $in: req.query.tags } };
        };        

        /* List of Shop ids that include at least one 
        of the tags we are intrested in */
        let shopIdListByTag: mongoose.DocumentQuery<mongoose.MongooseDocument[],
        mongoose.Document, {}> =
        Shop.find( shopByTagConditions,
        { _id: 1});

        
        // console.log(`Start: ${start} - Count: ${count} - 
        // dateFrom: ${req.query.dateFrom} - dateTo: ${req.query.dateTo} - shops: ${req.query.shops} -
        // products: ${req.query.products} - tags: ${req.query.tags} - sort*: ${req.query.sort}`)


        // // Query to get prices as described in restAPI specifications
        // let prices: mongoose.DocumentQuery<mongoose.MongooseDocument[],
        // mongoose.Document, {}> =
        productIdList.exec((err, productIdList) => {
            if (err) {
                res.send(err);
            } else {                
                shopIdList.exec((err, shopIdList) => {
                    if (err) {
                        res.send(err);
                    } else {                        
                        productIdListByTag.exec((err,productIdListByTag) => {
                            if (err) {
                                res.send(err)
                            } else {                                
                                shopIdListByTag.exec((err, shopIdListByTag) => {
                                    if (err) {
                                        res.send(err);
                                    } else {                                        
                                        Price.find({ $and: [
                                            { date: { $gte: req.query.dateFrom , $lte: req.query.dateTo } },
                                            { productId: { $in: productIdList } },
                                            { shopId: { $in: shopIdList } },
                                            { $or: [
                                                   { productId: { $in: productIdListByTag } },
                                                   { shopId: { $in: shopIdListByTag } }
                                            ]}
                                            ]})                   
                                            .populate({
                                                path: 'shopId',
                                                select: 'name address lng lat tags _id'
                                            })
                                            .populate({
                                                path: 'productId',
                                                select: 'name tags _id'
                                            })
                                            .exec((err, unprices) => {
                                                if (err) {
                                                    res.send(err);
                                                } else {

                                                    let input_lat = req.query.geoLat;
                                                    let input_lng = req.query.geoLng;

                                                    function deg2rad(deg) {
                                                        return deg * (Math.PI / 180)
                                                    }

                                                    function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number) {                                                        
                                                        let R = 6371; // Radius of the earth in km
                                                        let dLat = deg2rad(lat2 - lat1);  // deg2rad below
                                                        let dLon = deg2rad(lon2 - lon1);
                                                        let a =
                                                            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                                                            Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                                                            Math.sin(dLon / 2) * Math.sin(dLon / 2);

                                                        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                                                        let d = R * c; // Distance in km
                                                        return d;
                                                    }

                                                    

                                                    function flattenPrice(dl) {
                                                        var newdl : any = {};
                                                        newdl.price = dl.price;
                                                        newdl.date = dl.date;
                                                        newdl.productTags = dl.productId.tags;
                                                        newdl.productName = dl.productId.name;
                                                        newdl.productId = dl.productId.id;
                                                        newdl.shopTags = dl.shopId.tags;
                                                        newdl.shopName = dl.shopId.name;
                                                        newdl.shopAddress = dl.shopId.address;
                                                        newdl.shopLng = dl.shopId.lng;
                                                        newdl.shopLat = dl.shopId.lat;
                                                        newdl.shopId = dl.shopId.id;
                                                        newdl.shopDist = getDistanceFromLatLonInKm(dl.shopId.lat, 
                                                            dl.shopId.lng, input_lat, input_lng);
                                                        return newdl;
                                                    }

                                                    var prices = unprices.map(flattenPrice);

                                                    let sorted_prices = pricesort(req.query.start, req.query.count, prices, req.query.sort)
                                                    let total = unprices.length;

                                                    res.status(200).send({
                                                        start,
                                                        count,
                                                        total,
                                                        prices
                                                    });

                                                }
                                            });
                                    }
                                });
                            }
                        });                        
                    }
                });
            }
        });
    }



    public getPriceWithID(req: Request, res: Response) {
        Price.findById(
            { _id: req.params.priceId },
            (err, price) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(price);
                }
            });
    }

    public updatePrice(req: Request, res: Response) {
        Price.findOneAndUpdate(
            { _id: req.params.priceId },
            req.body, { new: true }, (err, price) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json(price);
                }
            });
    }

    public deletePrice(req: Request, res: Response) {
        Price.remove(
            { _id: req.params.priceId },
            (err: any) => {
                if (err) {
                    res.send(err);
                }
                else {
                    res.json({ message: 'Successfully deleted price!' });
                }
            });
    }


}
