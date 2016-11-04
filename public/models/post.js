var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var User = require(__public + 'models/user')

module.exports = mongoose.model('Post', {
    title: String,
    author: {type: Schema.Types.ObjectId, ref: 'User'},
    date: Date,
    content: String,
    home: Boolean,
    link: String,
    pics: [String],
    url: String
});
