import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;

export const UserSchema = new Schema({
    email: {
	    type: String,
        required: 'Enter email',
        index: true,
        unique: true
    },
    username: {
        type: String,
        required: 'Enter username',
        index: true,
        unique: true
    },
    password: {
        type: String,
        required: 'Enter password'
    },
    locked: {
        type: Boolean,
        required : true,
        default: false
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

UserSchema.post('save', (err, res, next) => {
    if (err.name === 'MongoError' && err.code === 11000) {
        next(err);
    } else {
        next();
    }
});

UserSchema.set('toJSON', {
    virtuals: true,
    versionKey: false,
    transform: function (doc, ret) { delete ret._id, delete ret.dateCreated }
});

// Error handler (error message customization)
UserSchema.post('save', function (error, doc, next) {
    if (error.name === 'ValidatorError' && error.code === 11000) {
        next(new Error('Bad Request'));
    } else {
        next();
    }
});

export const User = mongoose.model('User', UserSchema);
