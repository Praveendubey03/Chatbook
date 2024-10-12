const passport = require('passport');
const googleStrategy = require('passport-google-oauth').OAuth2Strategy;
const crypto = require('crypto');
const User = require('../models/user');

// tell passpost to use a new strategy for google login
passport.use(new googleStrategy({
    clientID: "276251860270-4bscv6dngkrsefock6dd6calusbc4683.apps.googleusercontent.com",
    clientSecret: "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",
    callbackURL: "http://localhost:8000/users/auth/google/callback",
},

async function (accessToken, refreshToken, profile, done) {
    try {
        // Find a user
        const user = await User.findOne({ email: profile.emails[0].value });

        console.log(profile);

        if (user) {
            // If found, set this user req.user
            return done(null, user);
        } else {
            // If not found, create the user and set it as req.user
            const newUser = await User.create({
                name: profile.displayName,
                email: profile.emails[0].value,
                password: crypto.randomBytes(20).toString('hex')
            });
            return done(null, newUser);
        }
    } catch (err) {
        console.log('error in google strategy-passport', err);
        return done(err); // Pass the error to done
    }
}));

module.exports = passport;