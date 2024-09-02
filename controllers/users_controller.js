const User = require('../models/user')

module.exports.profile = async function(req, res) {
    try {
        console.log('Rendering profile page'); // Debug log

        // Find the user by ID asynchronously
        const user = await User.findById(req.params.id).exec();

        // Check if the user exists
        if (!user) {
            return res.status(404).send('User not found');
        }

        // Render the 'user_profile' view with the user data
        return res.render('user_profile', {
            title: 'User Profile',
            profile_user: user
        });
    } catch (err) {
        // Handle any errors that occur during the find operation
        console.error('Error fetching user profile:', err);
        return res.status(500).send('Internal Server Error');
    }
};

// Render the signUp
module.exports.signUp = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }


    return res.render('users_sign_up', {
        title: "Codeial | Sign Up"
    })
}

// Render the Sign in
module.exports.signIn = function (req, res) {
    if(req.isAuthenticated()){
        return res.redirect('/users/profile');
    }
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
   return res.redirect('/');
}

module.exports.destroySession = function(req, res) {
    req.logout(function(err) {
        if (err) {
            console.log('Error while logging out:', err);
            return res.redirect('/'); // Redirect on error or handle it appropriately
        }
        return res.redirect('/'); // Redirect after successful logout
    });
};