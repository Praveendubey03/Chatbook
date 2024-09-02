
const Post = require('../models/post');
const User = require('../models/user');

module.exports.home = async function(req, res) {
    try {
        // Fetch posts with populated data
        const posts = await Post.find({})
            .populate('user')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user'
                }
            })
            .exec();
        
        // Fetch all users
        const users = await User.find({}).exec();
        
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