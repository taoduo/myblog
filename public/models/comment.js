var mongoose = require('mongoose');

module.exports = mongoose.model('Comment', {
    title: String,
    author: objectid,
    content: String,
    date: Date
});