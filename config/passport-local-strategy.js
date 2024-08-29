const passport = require('passport');
const User = require('../models/user');
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({
    usernameField: 'email'
},
async function(email, password, done) {
    try {
        // find a user and establish the identity
        const user = await User.findOne({ email: email });

        if (!user || user.password !== password) {
            console.log('Invalid username/password');
            return done(null, false);
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding the user --> Passport');
        return done(err);
    }
}));

// serializing the user to decide which key to keep in the cookie
passport.serializeUser(function(user, done) {
    done(null, user.id);
});

// deserialize the user from the key in the cookies
passport.deserializeUser(async function(id, done) {
    try {
        const user = await User.findById(id);

        if (!user) {
            return done(new Error('User not found'));
        }

        return done(null, user);
    } catch (err) {
        console.log('Error in finding the user --> Passport');
        return done(err);
    }
});


// check if the user is authenticated
passport.checkAuthentication = function(req, res, next) {
    if (req.isAuthenticated()) {
        return next(); // Ensure next() is called to proceed
    }
    return res.redirect('/users/sign-in');
};

passport.setAuthenticatedUser = function(req, res, next) {
    if (req.isAuthenticated()) {
        // req.user contains the current signed in user from the session cookie and we are just sending
        // this to the locals for the views
        res.locals.user = req.user;
    }
    next();
};


module.exports = passport;
