const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username:String,
    twitterid:String,
    displayName:String
    // profileImage:String
});

const User = mongoose.model('user', userSchema);

module.exports = User;