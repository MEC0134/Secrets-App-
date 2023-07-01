const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');  


mongoose.connect('mongodb://127.0.0.1:27017/usersDB', {useNewUrlParser: true});


const userChema = new mongoose.Schema({
    name: String, 
    email: String,
    password: String
});

const secret = 'mylongsecret';
userChema.plugin(encrypt, {secret: secret, excludeFromEncryption: ['name', 'email']});

const User = mongoose.model('User', userChema);


module.exports = {
    User: User
};