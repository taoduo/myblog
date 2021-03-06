var Post = require(__public + 'models/post.js');
var fs = require('fs');
module.exports = {
	getHomeBlog : function (req, res) {
		Post.find({
			'home':true
		}, function (err, post) {
			if (err) {
				res.status(500).end('Database Error');
			} else {
				res.send(post);
			}
		}).sort({date:-1}).limit(3).populate('author');
	},

	getBlog : function (req, res) {
		Post.find({}, function (err, post) {
			if (err) {
				res.status(500).end('Database Error');
			} else {
				res.send(post);
			}
		}).sort({date:-1}).limit(20).populate('author');
	},

	getUserBlog : function(req, res) {
		Post.find({'author':req.user._id}, function(err, post) {
			if (err) {
				res.status(500).end('Database Error');
			} else {
				res.send(post);
			}
		}).sort({date:-1}).populate('author');
	},

	postBlog : function(req, res) {
		var newPost = new Post();
		newPost.title = req.body.title;
		newPost.content = req.body.content;
		newPost.date = new Date();
		newPost.author = req.user;
		newPost.home = req.body.home;
		newPost.link = req.body.link;
		newPost.pics = req.body.pics;
		checkForDuplicate(res, newPost, savePost);
	},

	deleteBlog : function(req, res) {
		Post.findById(req.query.id, function(err, result) {
			for (var i in result.pics) {
				fs.unlink(__public + result.pics[i], (err) => {
					if (err) {
						console.log(err);
						res.status(500).end('File System Error');
					}
				});
			}
			Post.remove({'_id' : req.query.id}, function(err) {
				if (err) {
					console.log(err);
					res.status(500).end('Database Error');
				} else {
					res.status(200).end();
				}
			});
		});
	},

	editBlog : function(req, res) {
		var post = req.body;
		checkForDuplicate(res, post, updatePost);
	},

	getWithUrl : function(req, res, next) {
		var url = req.params.url;
		Post.find({'url' : url}, function(err, post) {
			if (err) {
				res.status(500).send('Database Error');
			} else {
				req.blog = post[0];
				next();
			}
		});
	}
}

/*
 * Check for duplicate titles.
 * Call callback if no duplicate
 */
function checkForDuplicate(res, newPost, callback) {
	Post.find({'title': newPost.title}, function(err, post) {
		if (err) {
			res.status(500).send('Database Error');
		} else {
			if (post == null) {
				callback(res, newPost);
			} else {
				res.status(400).send('Duplicate Title');
			}
		}
	});
}

/* Save post */
function savePost(res, newPost) {
	newPost.save(function(err) {
		if (err) {
			res.status(500).end('Database Error');
		} else {
			res.status(200).end();
		}
	});
}

/* Update post */
function updatePost(res, post) {
	Post.update({'_id' : post._id}, {$set : post}, function(err) {
		if (err) {
			res.status(500).send('Database Error');
		} else {
			res.status(200).end();
		}
	});
}
