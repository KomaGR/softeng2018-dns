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
    withdrawn: {
        type: Boolean
    },
    tags: [{
        type: String
    }],
    dateCreated: {
        type: Date,
        default: Date.now
    }
});