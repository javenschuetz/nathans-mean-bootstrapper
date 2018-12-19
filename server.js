'use strict';

// libraries (alphabetic)
const bcrypt = require('bcryptjs');					// cryptographic hashing algorithm for passwords
const body_parser = require('body-parser'); 		// to give us access to body of http requests
const client_sessions = require('client-sessions');	// mozilla library to implement encrypted client-side sessions
const csurf = require('csurf');						// mitigates against cross site request forgeries
const express = require('express');
const helmet = require('helmet');					// add some nice security headers
const mongoose = require('mongoose');				// mongo schemas
const path = require('path'); 						// helps resolve file paths

// project modules
const User = require('./models/User');				// User Schema



// ****************************************************************** some setup
const app = express();
mongoose.connect('mongodb://localhost/backbone-db');		// maintains a connection to mongo
app.set('view engine', 'ejs');								// says 'we're using ejs'
app.set('views', path.join(`${__dirname}/views`));			// says 'our ejs is here'
app.use('/static', express.static(`${__dirname}/static`)); 	// sort of automatic route handling for this directory



// ****************************************************************** middleware
app.use(helmet());

// to get request bodies in object form
app.use(body_parser.urlencoded({
    extended: false
}));

// set up client-side sessions
app.use(client_sessions({
    cookieName: 'session',
    secret: process.env.BACKBONE_SECRET, 	// basically a symmetric encryption key
    duration: 1000 * 60 * 30,				// 30 minutes
    activeDuration: 1000 * 60 * 5,
    httpOnly: true,
    secure: true,
    ephemeral: true
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


        delete user.password;	// unwanted if session exists. todo: don't pull from mongo
        req.user = user;
        res.locals.user = user;	// for serverside rendering variables

        return next();
    });
});

app.use(csurf());

// confirms that login was verified above
function login_required(req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }

    return next();
}



// ************************************************************ register & login
app.get('/register', (req, res) => {
    res.render('register', {csrfToken: req.csrfToken()});
});

app.post('/register', (req, res) => {
    // make sure to replace pw with hashed password before storing the user
    const hash = bcrypt.hashSync(req.body.password, parseInt(process.env.WORK_FACTOR));
    req.body.password = hash;
    let user = new User(req.body);

    user.save((err) => {
        if (err) {
        	// todo - make use of this (flash? template variable?)
            let error = "error when saving this user";

            if (err.code === 11000) {
                error = "email taken";
            }
            // not a PRG, but should be fine
            return res.render('register', {csrfToken: req.csrfToken()});
        }
        return res.redirect('login');
    });
});

app.get('/login', (req, res) => {
    res.render('login', {csrfToken: req.csrfToken()});
});

// todo - rate limiting in nginx for this
app.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.render('login', {csrfToken: req.csrfToken()});
        }

        // if logged in, use client-side session to stay logged in
        req.session.user_id = user._id;
        return res.redirect('dashboard');
    });
});



// ****************************************************** web app route handlers
app.get('/dashboard', login_required, (req, res) => {
    res.render('dashboard');
});

app.get('/logout', (req, res) => {
	res.clearCookie("session");
	res.redirect('/');
});



// ********************************************** unauthenticated route handlers
// Default landing page is our informational site
app.get('/', (req, res) => {
	res.render('index');
});

// Catch-all
app.get('*', (req, res) => {
	res.redirect('/');
});

// error handling
app.use((err, req, res, next) => {
  res.status(500).send("Something broke :( Please try again.");
});



// *********************************************************************** serve
// server listens on port X where Nginx is configured to forward requests to
const port = process.env.BACKBONE_PORT || 9000;
app.listen(port);
