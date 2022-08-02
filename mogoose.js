import mongoose from 'mongoose';
import passport from 'passport';
import passportLocalMongoose from 'passport-local-mongoose';

export default async function mongoConnect(mongoDBLink) {
    await mongoose.connect(mongoDBLink);

    const blogSchema = new mongoose.Schema({
        name: String,
        password: String,
        post: [{
            title: String,
            content: String
        }]
    });

    blogSchema.plugin(passportLocalMongoose);

    module.exports = mongoose.model('blog', blogSchema);
}



