const User = require('../models/user')

module.exports.profile = function (req, res) {
    return res.render('user_profile', {
        title: 'User Profile'
    })
}

// Render the signUp
module.exports.signUp = function (req, res) {
    return res.render('users_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// Render the Sign in
module.exports.signIn = function (req, res) {
    return res.render('users_sign_in', {
        title: "Codeial | Sign In"
    })
}

// Get the sign up data
module.exports.create = async function (req, res) {
    try {
        if (req.body.password !== req.body.confirm_password) {
            // Redirect back if passwords do not match
            return res.redirect('back');
        }

        // Use async/await to find the user
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            // Create a new user if one does not exist
            await User.create(req.body);

            // Redirect to the sign-in page
            return res.redirect('/users/sign-in');
        } else {
            // Redirect back if user already exists
            return res.redirect('back');
        }
    } catch (err) {
        console.log('Error in signing up:', err);
        return res.redirect('back');
    }
};


// sign in and create sessions
module.exports.createSessions = function (req, res) {
    // To do later
}