const Post = require('../models/post');

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

        // Redirect back to the previous page
        return res.redirect('back');
    } catch (err) {
        console.error('Error creating a post:', err);
        return res.status(500).send('Internal Server Error');
    }
};
