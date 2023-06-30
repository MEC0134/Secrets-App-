//jshint esversion:6 

const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const { User } = require('./db');

const app = express();


app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));



app.get('/', (req, res) => {
    res.render('home');
})

app.get('/login', (req, res) => {
    res.render('login');
});


// Register
app.get('/register', (req, res) => {
    res.render('register');
});

app.post('/register', (req, res) => {

    const userData = req.body;

    const newUser = new User({
        name: req.body.userName,
        email: req.body.userEmail,
        password: req.body.userPassword
    });

    if (userData.userPassword === userData.confirmPassword) {
        newUser.save()
            .then(savedUser => {
                console.log('User saved:', savedUser);
                res.render('secrets'); // Or send a success response
            })
            .catch(error => {
                console.error('Error saving user:', error);
                res.render('register', { errMessage: 'Error saving user' }); // Or send an error response
            });
    } else {
        res.render('register', {errMessage: "Password do not match!"})
    }

});



















app.listen(3000, () => {
    console.log('Server Running');
})