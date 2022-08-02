const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended : false}));

const mongoDBLink = process.env.MONGO_DB_LINK

async function mongoConnect() {
    await mongoose.connect(mongoDBLink);
}

mongoConnect().catch(err => {console.error(err)});

const blogSchema = new mongoose.Schema({
    title: String,
    content: String
});

const Blog = new mongoose.model('Blog', blogSchema);

mongoConnect(mongoDBLink).catch(err => {console.log(err)});

app.route('/')
    .get((req, res) => {
        Blog.find((err, users) => {
            err ? console.log(err) : res.send(users);
        });
    })
    .post((req, res) => {
        const newPost = new Blog({
            title: req.body.title,
            content: req.body.content
        });
        newPost.save(err => {err ? console.log(err) : res.send('Succesfully added new Post')});
    })
    .delete((req, res) => {
        Blog.deleteMany(err => {
            err ? console.log(err) : res.send('Succesfully deleted all account');
        })
    });

app.route('/:title')
    .get((req, res) => {
        const title = req.params.title;
        Blog.find({title: title}, (err, foundPost) => {
            foundPost ? res.send(foundPost) : console.log(err);
        });
    })
    .put((req, res) => {
        const title = req.params.title;
        Blog.replaceOne({title: title}, {title: req.body.title, content: req.body.content}, err => {
            err ? res.send(err) : res.send("Succesfully update post.");
        });
    })
    .patch((req, res) => {
        const title = req.params.title;
        Blog.updateOne({title: title}, {title: req.body.title, content: req.body.content}, err => {
            err ? res.send(err) : res.send("Succesfully update post.");
        }); 
    })
    .delete((req, res) => {
        const title = req.params.title;
        Blog.deleteOne({title: title}, err => {
            err ? res.send(err) : res.send("Succesfully deleted post");
        });
    });

app.listen(4000, () => {
    console.log('Created server on port 4000');
})