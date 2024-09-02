const Comment = require('../models/comment');
const Post = require('../models/post');

module.exports.create = async function (req, res) {
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



module.exports.destroy = async function(req, res) {
    try {
        // Find the comment by ID
        const comment = await Comment.findById(req.params.id).exec();
        
        if (!comment) {
            // If the comment does not exist, redirect back
            return res.redirect('back');
        }

        // Check if the current user is the owner of the comment
        if (comment.user.toString() === req.user.id.toString()) {
            // Extract the post ID from the comment
            const postId = comment.post;

            // Remove the comment ID from the post's comments array
            await Post.findByIdAndUpdate(postId, { $pull: { comments: req.params.id } }).exec();

            // Delete the comment
            await Comment.findByIdAndDelete(req.params.id).exec();

            // Redirect back
            return res.redirect('back');
        } else {
            // If the user is not the owner, redirect back
            return res.redirect('back');
        }
    } catch (err) {
        // Handle errors and respond appropriately
        console.error(err);
        return res.redirect('back');
    }
};