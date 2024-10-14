
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function (req, res) {
    try {
        // Fetch posts with populated data
        let posts = await Post.find({})
            .sort('-createdAt')
            .populate('user')
            .populate({
                path: 'comments',
                populate: [
                    { path: 'user' },
                    { path: 'likes' } // Ensure this matches your schema
                ]
            })
            .populate('likes'); // Ensure this matches your schema

        // Fetch all users
        let users = await User.find({}).exec();

        // Log fetched posts for debugging
        console.log('Fetched posts:', posts);

        // Render the 'home' view with the posts and users
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts,
            all_users: users
        });
    } catch (err) {
        // Handle errors and respond appropriately
        console.error('Error fetching posts or users:', err);
        return res.status(500).send('Internal Server Error');
    }
};