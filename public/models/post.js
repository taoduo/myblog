var mongoose = require('mongoose');
var User = require(__public + 'models/user')

module.exports = mongoose.model('Post', {
    title: String,
    author: User.schema,
    date: Date,
    content: String,
    home: Boolean,
    link: String
});
