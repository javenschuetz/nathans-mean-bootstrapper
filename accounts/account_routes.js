'use strict';

// libraries
const bcrypt = require('bcryptjs'); // cryptographic hashing algorithm for passwords
const csurf = require('csurf'); // mitigates against cross site request forgeries
const express = require('express');

// project modules
const User = require('./User');

// config
const router = express.Router();



// ********************************************************************** config
router.use(csurf());



// ********************************************************************** routes
router.get('/login', (req, res) => {
    res.render('login', {csrfToken: req.csrfToken(), logged_in: !!req.user});
});

// todo - rate limiting in nginx for this
router.post('/login', (req, res) => {
    User.findOne({email: req.body.email}, (err, user) => {
        if (err || !user || !bcrypt.compareSync(req.body.password, user.password)) {
            return res.render('login', {csrfToken: req.csrfToken(), logged_in: !!req.user});
        }

        // if logged in, use client-side session to stay logged in
        req.session.user_id = user._id;
        return res.redirect('/dashboard');
    });
});

router.get('/register', (req, res) => {
    res.render('register', {csrfToken: req.csrfToken(), logged_in: !!req.user});
});

// OWASP guidelines: https://www.owasp.org/index.php/Authentication_Cheat_Sheet
function check_password_strength(email, password) {

    const length = password.length;
    if (length < 10) return { strong: false, reason: 'password is too short'};
    if (length > 128) return { strong: false, reason: 'password is too long'};
    if (password.includes(email)) return { strong: false, reason: 'password cannot contain that'};
    if (password.includes('password')) return { strong: false, reason: 'password cannot contain that'};
    if (password.includes('Password')) return { strong: false, reason: 'password cannot contain that'};

    let score = 0;
    if (length >= 12) score++;
    if (length >= 16) score++;
    if (password.match(/\d+/)) score++; // 1+ numbers
    if (password.match(/[a-z]/)) score++; // lowercase
    if (password.match(/[A-Z]/)) score++; // uppercase
    if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~,-,£,(,)]/)) score++; // special characters

    return {
        strong: score >= 3,
        reason: `unless a password is quite long, it must satisfy 3/4 of the following criteria:
    - contain a number
    - contain a lowercase letter
    - contain an uppercase letter
    - contain a special character`
    };
}

router.post('/register', (req, res) => {
    const password_strength = check_password_strength(req.body.email, req.body.password);
    if (!password_strength.strong) {
        // todo - use the nice error messages in the rendering so the user can see them
        return res.render('register', {csrfToken: req.csrfToken(), logged_in: false});
    }

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
            return res.render('register', {csrfToken: req.csrfToken(), logged_in: false});
        }
        return res.redirect('/accounts/login');
    });
});

router.get('/logout', (req, res) => {
    req.session.reset();
    res.clearCookie("session");
    res.redirect('/');
});

module.exports = router;
