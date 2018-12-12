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
app.set('views', path.join(`${__dirname}/client`)); // says 'our ejs is here'

// in the html, 'assets' is an alias for the 'public' folder

// todo - only use static for the informational site
app.use('/static', express.static(`${__dirname}/client/public_static`));


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

// says 'these are from the serverside session' - asks 'who does it match?'
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


// ********************************************************* auth route handlers
// These route handlers should use the 'public' directory for all
// non-authenticated requests

// login page
app.get('/login', (req, res) => {
	// says 'if logged in, skip login. else, send to login page'
	if (req.session && req.session.passport && req.session.passport.user) {
		res.redirect('/app');
	} else {
		res.render('public/login');
	}

});

/*
	passport.authenticate seems to return some middleware?
	note: local is the passport.js 'strategy'
	this local strategy was set up in app.use above
*/
app.post('/login', passport.authenticate('local',
		// TODO - check if we need to sanitize anything
		{
			successRedirect: '/app',
            failureRedirect: '/app/login',
            failureFlash: false // if true, lets us display err message to user
        }
    )
);


// ****************************************************** web app route handlers

// middleware to help check for signins
function check_auth_status (req, res, next) {
	if (req.session && req.session.passport && req.session.passport.user) {
		next();
	} else {
		res.redirect('/login');
	}
}

// our main web app
app.get('/app', check_auth_status, (req, res) => {
	res.render('app');
});

app.use( "/app/assets", [ check_auth_status, express.static( __dirname + "/client" ) ] );

// catches junk uris
app.get('/app/*', check_auth_status, (req, res) => {
	res.redirect('/app');
});



// ********************************************** unauthenticated route handlers
//	These route handlers should only serve files from the 'public' directory

// Default landing page is our informational site
app.get('/', (req, res) => {
	res.sendFile(`${__dirname}/client/public/index.html`);
});

// Catch-all
app.get('*', (req, res) => {
	res.redirect('/');
});



// *********************************************************************** serve
// server listens on port X where Nginx is configured to forward requests to

const port = process.env.PORT || 9000;
app.listen(port);
