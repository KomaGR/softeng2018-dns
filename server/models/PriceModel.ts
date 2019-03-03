import * as mongoose from 'mongoose';
import { ProductSchema } from './ProductModel';
import { ShopSchema } from './ShopModel';

const Schema = mongoose.Schema;

export const PriceSchema = new Schema({
    price: {
        type: Number,
        required: 'Enter price'
    },
    date: {
        type: Date,
        required: 'Enter date',
        default: Date.now,
    },
    productId: {
        type: Schema.Types.ObjectId,
        required: 'Enter productId',
        ref: 'Product'
    },
    shopId: {
        type: Schema.Types.ObjectId,
        required: 'Enter shopId',
        ref: 'Shop'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

PriceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id, delete ret.dateCreated }
});

export const Price = mongoose.model('Price', PriceSchema);
