import * as mongoose from 'mongoose';
import * as express from 'express';

const Schema = mongoose.Schema;
type Request = express.Request;
type Response = express.Response;

export const ShopSchema = new Schema({
    name: {
        type: String,
        required: 'Enter name'
    },
    address: {
        type: String,
        required: 'Enter address'
    },
    lng: {
        type: Number,
        required: 'Enter longitude'
    },
    lat: {
        type: Number,
        required: 'Enter latitude'
    },
    location: {
        type: {type: String, default: 'Point'},
        coordinates: [Number],
    },
    tags: [{
        type: String,
        required: 'Enter tags'
    }],
    withdrawn: {
        type: Boolean,
        default: false,
        required: 'Set value'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

ShopSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id, delete ret.dateCreated }
});

// Error handler (error message customization)
ShopSchema.post('save', function(error, doc, next) {
    if (error.name === 'ValidatorError' && error.code === 11000) {
        next(error);
    } else {
        next();
    }
});

ShopSchema.index({ location: '2dsphere' });

export const Shop = mongoose.model('Shop', ShopSchema);
