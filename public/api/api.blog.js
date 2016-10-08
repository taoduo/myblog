var Post = require(__public + 'models/post.js');

module.exports = {
  getHomeBlog : function (req, res) {
    Post.find({'home':true}, function (err, post) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.send(post);
    }).sort({date:-1}).limit(3);
  },

  getBlog : function (req, res) {
    Post.find({}, function (err, post) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.send(post);
    }).sort({date:-1}).limit(20);
  },

  getUserBlog : function(req, res) {
    Post.find({'author':req.user._id}, function(err, post) {
      if (err) {
        console.log(err);
        throw err;
      }
      res.send(post);
    });
  },

  postBlog : function(req, res) {
    var newPost = new Post();
    newPost.title = req.body.title;
    newPost.content = req.body.content;
    console.log(newPost.content);
    newPost.date = new Date();
    newPost.author = req.user;
    newPost.home = req.body.home;
    newPost.link = req.body.link;
    newPost.save(function(err) {
      if (err) {
        console.log('some err');
        console.log('Error in Saving post: ' + err);
        throw err;
      }
      res.send('Posted!');
    })
  },

  deleteBlog : function(req, res) {
    Post.findById(req.query.id).remove(function(err) {
      if (err) {
        res.status(500).send('Database Error');
      } else {
        res.status(200).end();
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
    })
    res.status(200).send('from edit api');
  }
}
