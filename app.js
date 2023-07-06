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
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook');
const findOrCreate = require('mongoose-findorcreate');

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

const userSchema = new mongoose.Schema({
    googleId: String,
    facebookId: String,
    username: String,
    email: String,
    password: String,
    secret: String
});

userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, {
            id: user.id,
            username: user.username,
            picture: user.picture
        });
    });
});

passport.deserializeUser(function (user, cb) {
    process.nextTick(function () {
        return cb(null, user);
    });
});

//-------------------- FB & Google Auth Config ---------------------//
passport.use(new GoogleStrategy({
    clientID: process.env.client_id,
    clientSecret: process.env.client_secret,
    callbackURL: "http://localhost:3000/auth/google/secrets"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ googleId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));

passport.use(new FacebookStrategy({
    clientID: process.env.fb_appid,
    clientSecret: process.env.fb_secret,
    callbackURL: "http://localhost:3000/auth/facebook/secrets"
},
    function (accessToken, refreshToken, profile, cb) {
        console.log(profile);
        User.findOrCreate({ facebookId: profile.id }, function (err, user) {
            return cb(err, user);
        });
    }
));


//--------------------- GET ROUTES -----------------------//
app.get('/', (req, res) => {
    res.render('home');
});

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile'] }
    ));

app.get('/auth/google/secrets',
    passport.authenticate('google', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/secrets');
    });

app.get('/auth/facebook',
    passport.authenticate('facebook'));

app.get('/auth/facebook/secrets',
    passport.authenticate('facebook', { failureRedirect: '/login' }),
    function (req, res) {
        res.redirect('/secrets');
    });

app.get('/submit', (req, res) => {
    if (req.isAuthenticated()) {
        res.render('submit');
    } else {
        res.redirect('/login');
    }
});

app.get('/login', (req, res) => {
    const error = req.flash('error')[0];
    res.render('login', { error: error });
});

app.get('/secrets', (req, res) => {
    User.find({ "secret": { $ne: null } })
        .then(foundUsers => {
            if (foundUsers)
                res.render('secrets', { usersWithSecrets: foundUsers });
        })
        .catch(err => {
            console.log(err);
        });
});

app.get('/register', (req, res) => {
    res.render('register');
});

app.get("/logout", function (req, res) {
    req.logout((err) => {
        if (err) {
            console.log(err);
        } else {
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

app.post('/submit', (req, res) => {
    const secretSubmitted = req.body.secret;
    User.findById(req.user.id)
        .then(foundUser => {
            if (foundUser) {
                foundUser.secret = secretSubmitted;
                foundUser.save();
                res.redirect('/secrets');
            }
        })
        .catch(err => {
            console.log(err);
        });
});









app.listen(3000, () => {
    console.log('Server Running');
});