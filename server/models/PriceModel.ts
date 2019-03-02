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
    productId: {
        type: String,
        required: 'Enter productId'
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

PriceSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id, delete ret.dateCreated }
});

module.exports = mongoose.model('Price', PriceSchema);
