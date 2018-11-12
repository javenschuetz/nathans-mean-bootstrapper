'use strict';

// ******************************************************************** requires
const body_parser = require('body-parser');
const express = require('express'); // for easy & boring request handling
const express_session = require('express-session');
const fs = require('fs');
const local_strategy = require('passport-local');
const passport = require('passport');
const path = require('path'); // helps resolve file paths
const users = require('./db-wrappers/users');

const app = express();



// ****************************************************************** some setup
app.set('view engine', 'ejs'); // says 'we're using ejs'
app.set('views', path.join(`${__dirname}/public`)); // says 'our ejs is here'

// ****************************************************************** middleware
// todo - review how this works in more detail
// it basically modifies our request object to hold some session information
app.use(express_session({
	secret: "we need to have this not be plaintext", // todo fix the secret
	resave: false,
	saveUninitialized: false
}));
app.use(body_parser.urlencoded({extended: false})); // todo - what is urlencoded?

app.use(passport.initialize());
app.use(passport.session());

// says 'this is what we're storing in the serverside session'
// todo - we may want to use _id instead of email
passport.serializeUser((user, done) => {
	done(null, user.email);
});

// says 'these are from the serverside session - who does it match?'
passport.deserializeUser((email, done) => {
	users.find_user(email, (err, user) => {
		done(err, user);
	});
});

passport.use(new local_strategy(
	{ usernameField: 'email'}, // by default it expects field to be 'username'
	(email, password, done) => {
	    users.find_user(email, (err, user) => {
			if (err) return done(err);
			if (!user) {
				return done(null, false, { message: 'Incorrect email.' });
			}
			if (user.password_hash !== password) { // todo - use real validation
				return done(null, false, { message: 'Incorrect password.' });
			}
				return done(null, user);
			});
		}
));

// ************************************************************** route handlers
// todo - just make a router middleware when we have more than 3-4 routes

// in the html, 'assets' is an alias for the 'public' folder
app.use('/assets', express.static(`${__dirname}/public`));

app.get('/data_viewer', (req, res) => {
	// todo - I had assumed we were using hard-to-guess session ids,
	// not usernames in the cookie. This seems fishy
	if (req.session && req.session.passport && req.session.passport.user) {
		res.render('pages/data_viewer');
	} else {
		res.redirect('/login');
	}
});

app.get('/login', (req, res) => {
	res.render('pages/login');
});

// a 'catch all' handler for when nothing else is matched
app.get('*', (req, res) => {
	res.render('index');
});

// passport.authenticate seems to return some middleware?
// note: local is the passport.js 'strategy'
// this local strategy was set up in app.use above
app.post('/login',
		passport.authenticate('local',
		{
			successRedirect: '/data_viewer',
            failureRedirect: '/login',
            failureFlash: false // if true, lets us display err message to user
        }
    )
);



// *********************************************************************** serve
// server listens on port X
//    set to 80 for http requests
//    later, nginx will listen on 80 and forward requests here
const port = process.env.PORT || 9000;
app.listen(port);
