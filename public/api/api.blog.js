var Post = require(__public + 'models/post.js');
var fs = require('fs');

module.exports = {
  getHomeBlog : function (req, res) {
    Post.find({'home':true}, function (err, post) {
      if (err) {
        res.status(500).end('Database Error');
      } else {
        res.send(post);
      }
    }).sort({date:-1}).limit(3);
  },

  getBlog : function (req, res) {
    Post.find({}, function (err, post) {
      if (err) {
        res.status(500).end('Database Error');
      } else {
        res.send(post);
      }
    }).sort({date:-1}).limit(20);
  },

  getUserBlog : function(req, res) {
    Post.find({'author':req.user._id}, function(err, post) {
      if (err) {
        res.status(500).end('Database Error');
      } else {
        res.send(post);
      }
    }).sort({date:-1});
  },

  postBlog : function(req, res) {
    var newPost = new Post();
    newPost.title = req.body.title;
    newPost.content = req.body.content;
    newPost.date = new Date();
    newPost.author = req.user;
    newPost.home = req.body.home;
    newPost.link = req.body.link;
    newPost.pics = req.body.pics; // no public
    console.log(req.body);
    newPost.save(function(err) {
      if (err) {
        res.status(500).end('Database Error');
      } else {
        res.status(200).end();
      }
    })
  },

  deleteBlog : function(req, res) {
    Post.findById(req.query.id).remove(function(err, removed) {
      if (err) {
        res.status(500).end('Database Error');
      } else {
        console.log(removed);
        for (var pic in removed.pics) {
          fs.unlink(pic, (err) => {
            if (err) {
              res.status(500).end('File System Error');
            } else {
              res.status(200).end();
            }
          });
        }
      }
    });
  },

  editBlog : function(req, res) {
    var post = req.body;
    Post.update({'_id' : post._id}, {$set : post}, function(err) {
      if (err) {
        res.status(500).send('Database Error');
      } else {
        res.status(200).end();
      }
    });
  }
}
