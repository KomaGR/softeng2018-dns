import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const ProductSchema = new Schema({
    id: {
        type: String
    },
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
    withdrawn: {
        type: Boolean
    },
    tags: [{
        type: String
    }],
    created_date: {
        type: Date,
        default: Date.now
    }
});
