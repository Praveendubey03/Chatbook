
const Post = require('../models/post')

module.exports.home = async function (req, res) {
    try {
        // Find all posts asynchronously
        const posts = await (Post.find({})).populate('user')
        .exec();
        // Render the 'home' view with the posts
        return res.render('home', {
            title: "Codeial | Home",
            posts: posts
        });
    } catch (err) {
        // Handle any errors that occur during the find operation
        console.error('Error fetching posts:', err);
        return res.status(500).send('Internal Server Error');
    }
}