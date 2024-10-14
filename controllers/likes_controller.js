const Like = require("../models/like");
const Post = require("../models/post");
const Comment = require("../models/comment");

module.exports.toggleLike = async function (req, res) {
    try {
        let likeable;
        let deleted = false;

        // Fetch the likeable object based on type
        if (req.query.type === 'Post') {
            likeable = await Post.findById(req.query.id).populate('likes');
        } else {
            likeable = await Comment.findById(req.query.id).populate('likes');
        }

        // Check if a like already exists
        let existingLike = await Like.findOne({
            likeable: req.query.id,
            onModel: req.query.type,
            user: req.user._id
        });

        if (existingLike) {
            // Remove the like
            likeable.likes.pull(existingLike._id); // Ensure 'likes' is correct
            await likeable.save(); // Await the save

            // Use deleteOne instead of remove
            await Like.deleteOne({ _id: existingLike._id });
            deleted = true;
        } else {
            // Add a new like
            let newLike = await Like.create({
                user: req.user._id,
                likeable: req.query.id, // Use req.query.id
                onModel: req.query.type
            });

            likeable.likes.push(newLike._id); // Ensure 'likes' is correct
            await likeable.save(); // Await the save
        }

        return res.status(200).json({
            message: 'Request successful',
            data: {
                deleted: deleted
            }
        });
    } catch (err) {
        console.error(err); // Log the error
        return res.status(500).json({
            message: 'Internal Server Error'
        });
    }
};
