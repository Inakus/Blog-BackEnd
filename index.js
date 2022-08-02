const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
const session =  require('express-session');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended : false}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));
app.use(passport.initialize());
app.use(passport.session());

const mongoDBLink = process.env.MONGO_DB_LINK

async function mongoConnect() {
    await mongoose.connect(mongoDBLink);
}

mongoConnect().catch(err => {console.error(err)});

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    blog: [{title: String, content: String}]
});

userSchema.plugin(passportLocalMongoose);

const User = new mongoose.model('User', userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

mongoConnect(mongoDBLink).catch(err => {console.log(err)});

app.route('/')
    .get((req, res) => {
        User.find((err, users) => {
            err ? console.log(err) : res.send(users);
        });
    })
    .post((req, res) => {
        User.register({username: req.body.username}, req.body.password, (err, user) => {
            err ? console.log(err) : passport.authenticate('local')(req, res, () => {
                res.redirect('/user/' + req.body.username);
            })
        });
    })
    .delete((req, res) => {
        User.deleteMany(err => {
            err ? console.log(err) : res.send('Succesfully deleted all account');
        })
    });

app.route('/user/:userName')
    .get((req, res) => {
        const userName = req.params.userName;
        User.find({username: userName}, (err, foundUser) => {
            foundUser ? res.send(foundUser) : console.log(err);
        });
    })
    .put((req, res) => {
        const userName = req.params.userName;
        User.replaceOne({username: userName}, {blog: [{title: req.body.title, content: req.body.content}]}, err => {
            err ? res.send(err) : res.send("Succesfully update article.");
        });
    })
    .patch((req, res) => {
        const userName = req.params.userName;
        User.updateOne({username: userName}, {blog: [{title: req.body.title, content: req.body.content}]}, err => {
            err ? res.send(err) : res.send("Succesfully update article.");
        }); 
    })
    .delete((req, res) => {
        const userName = req.params.userName;
        User.deleteOne({username: userName}, err => {
            err ? res.send(err) : res.send("Succesfully deleted user");
        });
    });

app.listen(4000, () => {
    console.log('Created server on port 4000');
})