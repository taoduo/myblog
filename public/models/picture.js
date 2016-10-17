var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Post = require(__public + 'models/post')

module.exports = mongoose.model('Picture', {
    name : String,
    blog : {type: Schema.Types.ObjectId, ref: 'Post'}
});
