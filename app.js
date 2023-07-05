//jshint esversion:6 
require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');
const flash = require('connect-flash');

const app = express();
app.use(flash());

mongoose.set('strictQuery', false);

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');

app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {}
}));


app.use(passport.initialize());
app.use(passport.session());

//-------------- DB Connection ----------------------//
mongoose.connect(process.env.db_uri, { useNewUrlParser: true })
    .then(() => {
        console.log('Database Connected');
    })
    .catch(err => {
        console.log(err);
    });
//-------------- DB Connection ----------------------//

const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String,
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


//--------------------- GET ROUTES -----------------------//
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/login', (req, res) => {
    const error = req.flash('error')[0];
    res.render('login', { error: error });
});

app.get('/secrets', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('secrets');
    } else {
        res.redirect('/login');
    }
});

app.get('/register', (req, res) => {
    res.render('register');
});
app.get("/logout", function(req,res){
    req.logout((err)=>{
        if(err){
            console.log(err);
        }else{
            res.redirect("/");
        }
    });
});


//--------------------- POST ROUTES -----------------------//
app.post('/register', (req, res) => {
    const username = req.body.username;
    const useremail = req.body.useremail;
    const password = req.body.password;
    User.register({ username: username, email: useremail }, password).then(() => {
        const authenticate = passport.authenticate('local');
        authenticate(req, res, () => {
            res.redirect('/secrets');
        });
    }).catch(err => {
        console.log(err);
        res.redirect("/register");
    });
});

app.post("/login", passport.authenticate('local', {
    successRedirect: '/secrets',
    failureRedirect: '/login',
    failureFlash: true,
}), function (req, res) {
    res.redirect("/secrets");
});





app.listen(3000, () => {
    console.log('Server Running');
});