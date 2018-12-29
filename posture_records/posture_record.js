'use strict';

// libraries
const mongoose = require('mongoose');

// config
const ObjectId = mongoose.Schema.Types.ObjectId;



// ******************************************************************* the model
module.exports = mongoose.model('daily_posture_records', new mongoose.Schema({
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
    minutes_per_hour: [
    	{ type : Number }
    ]
}));

// const posture_records = []; // for testing!!

// module.exports = class daily_posture_record {
// 	constructor(data) {
// 		// todo - validate
// 		this.email = data.email; // foo@bar.com
// 		this.day = data.day; // 1-31
// 		this.month = data.month; // 1-12
// 		this.year = data.year; // eg, 1980
// 		this.minutes_per_hour = data.minutes_per_hour; // hours/indices from 0-23
// 	}

// 	save() {
// 		let found = false;
// 		posture_records.forEach((record, index) => {
// 			// if record exists, update it
// 			if (record.email === this.email && record.date === this.date) {
// 				posture_records[index].update_minutes(this.minutes_per_hour);
// 				found = true;
// 			}
// 		});
// 		if (!found) posture_records.push(this); // create record if it dne
// 	}

// 	update_minutes(minutes_per_hour) {
// 		// todo - actually validate input
// 		if (minutes_per_hour.length > 0) {
// 			this.minutes_per_hour = minutes_per_hour;
// 		}
// 	}

// 	static fetch_all() {
// 		return posture_records;
// 	}
// }