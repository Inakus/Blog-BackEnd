import express from 'express';
import bodyParser from 'body-parser';
import passport from 'passport';
import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
import mongoConnect from './mogoose.js';
import session from 'express-session';
import 'dotenv/config';

const app = express();

app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {secure: true}
}));
app.use(passport.initialize());
app.use(passport.session());

const mongoDBLink = process.env.MONGO_DB_LINK

mongoConnect(mongoDBLink).catch(err => {console.log(err)});

passport.use(new LocalStrategy(mongoConnect.autenticate()));


app.route('/')
    .get((req, res) => {
        res.send('Dzieki dziala');
    })

app.listen(4000, () => {
    console.log('Created server on port 4000');
})