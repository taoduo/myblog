var Post = require(__public + 'models/post.js');

module.exports.getHomeBlog = function (req, res) {
  Post.find({'home':true}, function (err, post) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(post);
  }).sort({date:-1}).limit(3);
};

module.exports.getBlog = function (req, res) {
  Post.find({}, function (err, post) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(post);
  }).sort({date:-1}).limit(20);
};

module.exports.getUserBlog = function(req, res) {
  Post.find({'author':req.user._id}, function(err, post) {
    if (err) {
      console.log(err);
      throw err;
    }
    res.send(post);
  });
}

module.exports.postBlog = function(req, res) {
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
  });
}
