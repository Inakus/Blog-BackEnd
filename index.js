const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(bodyParser.urlencoded({extended: true}));
app.use(cors());

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
        Blog.find((err, post) => {
            err ? res.send(err) : res.send(post);
        });
    })
    .post((req, res) => {
        const title = req.body.title;
        const content = req.body.content;

        const newPost = new Blog({
            title: title,
            content: content
        });
        newPost.save(err => {err ? res.send(err) : res.send('Succesfully added new Post')});
    })
    .delete((req, res) => {
        Blog.deleteMany(err => {
            err ? res.send(err) : res.send('Succesfully deleted all Post');
        })
    });

app.route('/:id')
    .get((req, res) => {
        const id = req.params.id;
        Blog.find({_id: id}, (err, foundPost) => {
            foundPost ? res.send(JSON.stringify(foundPost)) : console.log(err);
        });
    })
    .put((req, res) => {
        const id = req.params.id;
        Blog.replaceOne({_id: id}, {title: req.body.title, content: req.body.content}, err => {
            err ? res.send(err) : res.send("Succesfully update post.");
        });
    })
    .patch((req, res) => {
        const id = req.params.id;
        Blog.updateOne({_id: id}, {title: req.body.title, content: req.body.content}, err => {
            err ? res.send(err) : res.send("Succesfully update post.");
        }); 
    })
    .delete((req, res) => {
        const id = req.params.id;
        Blog.deleteOne({_id: id}, err => {
            err ? res.send(err) : res.send("Succesfully deleted post");
        });
    });

app.listen(4000, () => {
    console.log('Created server on port 4000');
})