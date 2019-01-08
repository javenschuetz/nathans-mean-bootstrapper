'use strict';

// libraries (alphabetic)
const body_parser = require('body-parser');         // to give us access to body of http requests
const client_sessions = require('client-sessions'); // mozilla library to implement encrypted client-side sessions
const express = require('express');
const helmet = require('helmet');                   // add some nice security headers
const mongoose = require('mongoose');               // mongo schemas

// project modules
const User = require('./accounts/User');              // User Schema



// ****************************************************************** some setup
const app = express();
mongoose.connect('mongodb://localhost/backbone-db', {useNewUrlParser: true});        // maintains a connection to mongo
mongoose.set('useCreateIndex', true);
app.set('view engine', 'pug');                              // templating engine
app.set('views', `${__dirname}/client/views`);          // says 'our ejs is here'
app.use('/static', express.static(`${__dirname}/client/static`));  // sort of automatic route handling for this directory



// ****************************************************************** middleware
app.use(helmet());

// to get request bodies in object form
app.use(body_parser.urlencoded({
    extended: false
}));

// set up client-side sessions
app.use(client_sessions({
    cookieName: 'session',
    secret: process.env.BACKBONE_SECRET,    // basically a symmetric encryption key
    duration: 1000 * 60 * 30,               // 30 minutes
    activeDuration: 1000 * 60 * 5,
    cookie: {
        path: '/',
        httpOnly: true,
        sameSite: true,
        secureProxy: !process.env.IS_DEV,
        ephemeral: true
    }
}));

// lookup user ahead of time, must be after client_sessions
app.use((req, res, next) => {
    // if session does not exist, it was not found above by client_sessions.
    if (!req.session) {
        return next();
    }

    User.findById(req.session.user_id, (err, user) => {
        if (err) return next(err);
        if (!user) return next();


        delete user.password;   // unwanted if session exists. todo: don't pull from mongo
        req.user = user;
        res.locals.user = user; // for serverside rendering variables

        return next();
    });
});

// confirms that login was verified above
function login_required(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }

    return next();
}

function login_required_mobile(req, res, next) {
    // warning todo - commented out for testing
    // if (!req.user) {
    //     return res.status(401).send('Unauthorized');
    // }

    return next();
}



// ********************************************************************** routes
// login, register, logout
app.use('/accounts', require('./accounts/account_routes'));


// todo - is it safe to leave this here?
// get / post posture records
app.use(body_parser.json()); // these requests use application/json in the body
app.use('/posture_records', login_required_mobile, require('./posture_records/posture_record_routes'));

// main app dashboard
app.get('/dashboard', login_required, (req, res) => {
    res.render('dashboard', {logged_in: true});
});

// Default landing page is our informational site
app.get('/', (req, res) => {
    res.render('index', {logged_in: !!req.user});
});

// Catch-all
app.get('*', (req, res) => {
    res.redirect('/');
});



// ************************************************************** error handling
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send("Something broke :( Please try again.");
});



// *********************************************************************** serve
// server listens on port X where Nginx is configured to forward requests to
const port = process.env.BACKBONE_PORT || 9000;
app.listen(port);
