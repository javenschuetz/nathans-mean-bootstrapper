'use strict';

// libraries
const mongoose = require('mongoose');

// config
const ObjectId = mongoose.Schema.Types.ObjectId;



// ******************************************************************* the model
module.exports = mongoose.model('daily_data_records', new mongoose.Schema({
	user_id: {
		type : String, // type : ObjectId // could be preferable
		required: true
	},
    // email: {
    // 	type : String,
    // 	required: true
    // },
    year: {
    	type: Number,
    	required: true
    },
    month: {
    	type: Number,
    	required: true
    },
    day: {
    	type: Number,
    	required: true
    },
    events_per_hour: [
    	{ type : Number }
    ]
}));
