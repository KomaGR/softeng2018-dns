import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;


export const PriceSchema = new Schema({
    price: {
        type: Number,
        required: 'Enter price'
    },
    dateFrom: {
        type: Date,
        default: Date.now
    },
    dateTo: {
        type: Date,
        default: Date.now
    },
    PriceId: {
        type: String,
        required: 'Enter PriceId'
    },
    shopId: {
        type: String,
        required: 'Enter shopId'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

let Price = module.exports = mongoose.model('Price', PriceSchema);
