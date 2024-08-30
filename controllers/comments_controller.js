const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function(req, res) {
    try {
        // Find the post by ID
        const post = await Post.findById(req.body.post);

        if (post) {
            // Create a new comment
            const comment = await Comment.create({
                content: req.body.content, // Ensure content is coming from the correct field
                post: req.body.post,
                user: req.user._id
            });

            // Initialize comments array if it's undefined
            if (!post.comments) {
                post.comments = [];
            }

            // Add the new comment to the post's comments array
            post.comments.push(comment._id); // Store the comment ID instead of the comment object
            await post.save();

            // Redirect to the homepage or another page
            return res.redirect('/');
        } else {
            // Handle case where post is not found
            return res.status(404).send('Post not found');
        }
    } catch (err) {
        // Handle errors
        console.error(err);
        return res.status(500).send('Server error');
    }
};
