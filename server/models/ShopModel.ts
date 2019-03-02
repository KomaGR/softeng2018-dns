import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

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
        type: String,
        required: 'Enter longitude'
    },
    lat: {
        type: String,
        required: 'Enter latitude'
    },
    tags: [{
        type: String
    }],
    withdrawn: {
        type: Boolean
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

ShopSchema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('Shop', ShopSchema);
