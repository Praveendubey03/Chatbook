const Post = require('../models/post');
const Comment = require('../models/comment')

module.exports.create = async function (req, res) {
    try {
        // Check if the request body contains content and if the user is authenticated
        if (!req.body.content || !req.user || !req.user._id) {
            console.log('Invalid request: missing content or user ID');
            return res.status(400).send('Bad Request: Missing content or user ID');
        }

        // Create a new post
        await Post.create({
            content: req.body.content,
            user: req.user._id
        });

        req.flash('success', 'Post published!');
        // Redirect back to the previous page
        return res.redirect('back');
    } catch (err) {
        req.flash('error', err);
        return res.status(500).send('Internal Server Error');
    }
};

module.exports.destroy = async function(req, res) {
    try {
        // Find the post by ID
        const post = await Post.findById(req.params.id).exec();

        if (!post) {
            // If the post does not exist, redirect back
            return res.redirect('back');
        }

        // Check if the current user is the owner of the post
        if (post.user.toString() === req.user.id.toString()) {
            // Delete the post
            await Post.findByIdAndDelete(req.params.id).exec();

            // Delete all comments associated with the post
            await Comment.deleteMany({ post: req.params.id }).exec();

            req.flash('success', 'Post and associated comments deleted!');
            // Redirect back
            return res.redirect('back');
        } else {

            req.flash('error', 'You cannot delete this post');
            // If the user is not the owner, redirect back
            return res.redirect('back');
        }
    } catch (err) {
        // Handle errors and respond appropriately
        req.flash('error', err);
        return res.redirect('back');
    }
};