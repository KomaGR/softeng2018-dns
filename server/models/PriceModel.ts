var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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

// Error handler (error message customization)
PriceSchema.post('save', function (error, doc, next) {
    if (error.name === 'ValidatorError' && error.code === 11000) {
        next(new Error('Bad Request'));
    } else {
        next();
    }
});

export const Price = mongoose.model('Price', PriceSchema);
