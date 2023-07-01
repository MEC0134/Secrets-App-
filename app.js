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

// Register Routes
app.get('/register', (req, res) => {
    res.render('register', { errMessage: '' });
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
                res.render('secrets');
            })
            .catch(err => {
                console.error('Error saving user:', err);
            });
    } else {
        res.render('register', { errMessage: "Password do not match!" })
    }
});


// Login Routes
app.get('/login', (req, res) => {
    res.render('login', { errMessage: '' });
});
app.post('/login', (req, res) => {

    const userEmail = req.body.userEmail;
    const userPassword = req.body.userPassword;

    User.findOne({ email: userEmail })
        .then(foundUser => {
            if (foundUser.password === userPassword) {
                res.render('secrets');
            } else {
                res.render('login', { errMessage: 'Email or Passowrd is wrong, please try again!' })
                console.log(foundUser.password);
            }
        })
        .catch(err => {
            console.log('Error: ' + err);
        });
});
 













app.listen(3000, () => {
    console.log('Server Running');
})