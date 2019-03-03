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
      next(new Error('Bad Request'));
    } else {
      next();
    }
  });

export const Shop = mongoose.model('Shop', ShopSchema);
