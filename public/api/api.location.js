var Location = require(__public + 'models/location.js');
var LocationRecord = require(__public + 'models/locationRecord.js');

module.exports = {
  getLocation : function(req, res) {
    Location.find({}, function(err, location) {
      if (err) {
        console.log(err);
        res.status(500).send('Database Error');
        throw err;
      }
      res.status(200).send(location);
    }).sort({time:-1}).limit(10)
  },

  postLocation : function(req, res, next) {
    var newPos = req.body;
    var newLoc = new Location();
    newPos.lat = parseFloat(newPos.lat);
    newPos.lng = parseFloat(newPos.lng);
    newLoc.lat = newPos.lat;
    newLoc.lng = newPos.lng;
    newLoc.time = new Date();
    req.recordTime = newLoc.time;
    if (newPos.comment) {
      newLoc.comment = newPos.comment;
    } else {
      newLoc.comment = '';
    }

    newLoc.save(function(err) {
      if (err) {
        res.status(500).send("Database Error");
        throw err;
      }
      if (newLoc.comment != 'Administrator Login') {
        next();
      } else {
        res.end();
      }
    });
  },

  deleteLocation : function(req, res) {
    Location.findById(req.query.id).remove(function(err) {
      if (err) {
        res.status(500).send('Database Error');
      } else {
        res.status(200).end();
      }
    });
  },

  checkRecordExistence : function(req, res, next) {
    var newPos = req.body;
    LocationRecord.aggregate([
      {
        $project: {
          dist: {
            $add: [
              { $multiply: [ { $subtract: [ newPos.lng, "$lng" ] }, { $subtract: [ newPos.lng, "$lng" ] } ] },
              { $multiply: [ { $subtract: [ newPos.lat, "$lat" ] }, { $subtract: [ newPos.lat, "$lat" ] }] }
            ]
          }
        }
      },
      {$sort: {dist: 1, recent: -1}},
      {$limit: 1}
    ], function(err, result) {
      if (err) {
        console.log(err);
        res.send("error");
        throw err;
      }
      if (result.length == 0) {
        next();
      } else {
        LocationRecord.findById(result[0]._id, function(err, result) {
          if (err) {
            console.log(err);
            throw err;
          }
          if (result.comment != newPos.comment) {
            next();
          } else {
            LocationRecord.update({_id : result._id}, {recent : req.recordTime});
            res.send("Posted!");
          }
        });
      }
    });
  },

  saveRecord : function(req, res) {
    var newPos = req.body;
    var nr = new LocationRecord();
    nr.lat = newPos.lat;
    nr.lng = newPos.lng;
    nr.comment = newPos.comment;
    nr.recent = req.recordTime;
    nr.save(function(err) {
      if (err) {
        res.send("error");
        throw err;
      }
      res.send("Posted!(New record)");
    });
  },

  locationGuess : function(req, res) {
    var lng = parseFloat(req.query.lng);
    var lat = parseFloat(req.query.lat);
    LocationRecord.aggregate([
      {
        $project: {
          dist: {
            $add: [
              { $multiply: [ { $subtract: [ lng, "$lng" ] }, { $subtract: [ lng, "$lng" ] } ] },
              { $multiply: [ { $subtract: [ lat, "$lat" ] }, { $subtract: [ lat, "$lat" ] }] }
            ]
          }
        }
      },
      {$sort: {'dist': 1}},
      {$limit: 1}
    ], function(err, result) {
      if (err) {
        console.log(err);
        res.send("error");
        throw err;
      }
      if (result.length == 0) {
        res.send("");
      } else {
        LocationRecord.findById(result[0]._id, function(err, result) {
          if (err) {
            console.log(err);
            throw err;
          }
          res.send(result.comment);
        });
      }
    });
  }
}
