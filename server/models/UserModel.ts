import * as mongoose from 'mongoose';

const Schema = mongoose.Schema;
    username: {
        type: String,
        required: 'Enter username'
    },
    password: {
        type: String,
        required: 'Enter password'
    },
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

let User = module.exports = mongoose.model('User', UserSchema);
