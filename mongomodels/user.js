const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:String,
    twitterid:String,
    displayName:String,
    // profileImage:String,
    advaccount:Boolean,
    pubaccount:Boolean
});

const User = mongoose.model('user', userSchema);

module.exports = User;