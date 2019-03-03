import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ProductSchema = new Schema({
    name: {
        type: String,
        required: 'Enter name'
    },
    description: {
        type: String,
        required: 'Enter description'
    },
    category: {
        type: String,
        required: 'Enter category'
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

ProductSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id , delete ret.dateCreated }
});

// Error handler (error message customization)
ProductSchema.post('save', function(error, doc, next) {
    if (error.name === 'ValidatorError' && error.code === 11000) {
      next(new Error('Bad Request'));
    } else {
      next();
    }
  });

export const Product = mongoose.model('Product', ProductSchema);