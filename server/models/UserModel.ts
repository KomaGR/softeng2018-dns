import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export interface User extends mongoose.Document {
    email: string;
    username: string;
    password: string;
    role: string;
    dateCreated: Date;
}

export const UserSchema = new Schema({
    email: {
	type: String,
	required: 'Enter email'
    },
    username: {
        type: String,
        required: 'Enter username',
        index: true
    },
    password: {
        type: String,
        required: 'Enter password'
    },
    role: {
	type: String,
    default: 'user',
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id, delete ret.dateCreated }
});

module.exports = mongoose.model('User', UserSchema);
