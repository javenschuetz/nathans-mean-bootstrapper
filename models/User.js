'use strict';

const mongoose = require('mongoose');

module.exports = mongoose.model('User', new mongoose.Schema({
    first_name: {type: String, required: true},
    last_name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true}
}));
