var mongoose = require('mongoose');

module.exports = mongoose.model('Location', {
    lat: Number,
    lng: Number,
    time: Date,
    comment: String
});