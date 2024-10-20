const dotenv = require('dotenv').config();
const express = require('express');

const env = require('./config/environment');
const logger = require('morgan');
const viewHelper = require('./config/view-helper');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const passport = require('passport');
const passportLocal = require('./config/passport-local-strategy');
const passportJWT = require('./config/passport-jwt-strategy');
const passportGoogle = require('./config/passport-google-oauth2-strategy');
const expressLayouts = require('express-ejs-layouts');
const db = require('./config/mongoose');
const MongoStore = require('connect-mongo');
const sassMiddleware = require('node-sass-middleware');
const flash = require('connect-flash');
const customMware = require('./config/middleware');
const path = require('path');

const app = express();
viewHelper(app);
const port = 8000;
// setup the chat server to be used with socket.io
const chatServer = require('http').Server(app);
const chatSockets = require('./config/chat_sockets').chatSockets(chatServer);
chatServer.listen(5000);
console.log('chat server is listening on port 5000');

if (env.name == 'development') {
    app.use(sassMiddleware({
        src: path.join(__dirname, env.asset_path, 'scss'),
        dest: path.join(__dirname, env.asset_path, 'css'),
        debug: true,
        outputStyle: 'expanded',
        prefix: '/css'
    }))
}

// Middleware setup
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(env.asset_path));
// Make the uploads path available to the browser
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


app.use(logger(env.morgan.mode, env.morgan.options));
app.use(expressLayouts);

// View engine setup
app.set('view engine', 'ejs');
app.set('views', './views');
app.set('layout extractStyles', true);
app.set('layout extractScripts', true);

// Session middleware with MongoStore
app.use(session({
    name: 'codeial',
    secret: env.session_cookie_key, // Use a strong secret in production
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

