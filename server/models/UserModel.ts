import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

const UserSchema = new Schema({
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
	    default: 'user'

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

export const User = mongoose.model('User', UserSchema);
