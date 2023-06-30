const mongoose = require('mongoose');


mongoose.connect('mongodb://127.0.0.1:27017/usersDB', {useNewUrlParser: true});


const userChema = mongoose.Schema({
    name: String, 
    email: String,
    password: String
});


const User = mongoose.model('User', userChema);


module.exports = {
    User: User
};