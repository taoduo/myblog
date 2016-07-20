var mongoose = require('mongoose');

module.exports = mongoose.model('LocationRecord', {
    lat: Number,
    lng: Number,
    recent: Date,
    comment: String
});
