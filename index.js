const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo'); 
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const path = require('path'); 

const app = express();
const port = 8000;

app.use(sassMiddleware({
    src: './assets/scss',
    dest: './assets/css',
    debug: true,
    outputStyle: 'expanded',
    prefix: '/css'
}))
// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static('./assets'));
// Make the uploads path available to the browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(expressLayouts);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Session middleware with MongoStore
app.use(session({
    name: 'codeial',
    secret: 'blahsomething', // Use a strong secret in production
    saveUninitialized: false,
    resave: false,
    cookie: {
        maxAge: (1000 * 60 * 100) // 100 minutes
    },
    store: MongoStore.create({
        mongoUrl: 'mongodb://localhost/codeial', // Your MongoDB connection string
        mongooseConnection: db.connection, // Use `db.connection` if you export `mongoose`
        autoRemove: 'disabled'
    })
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Set authenticated user
app.use(passport.setAuthenticatedUser);
app.use(flash());
app.use(customMware.setFlash);

// Routes
app.use('/', require('./routes'));

app.listen(port, function (err) {
    if (err) {
        console.log(`Error in running the server: ${err}`);
        return;
    }
    console.log(`Server is running on port: ${port}`);
});

