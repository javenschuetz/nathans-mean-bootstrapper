'use strict';

// libraries
const express = require('express');
const mongoose = require('mongoose');

// project modules
const DailyDataRecord = require('./data_record');



// ********************************************************************** config
// config
const router = express.Router();
const ObjectId = mongoose.Types.ObjectId;



// ********************************************************************** routes
router.get('/:user_id/:year/:month/:day', (req, res) => {
    const query = {
    	$and: [
    		{user_id: req.params.user_id},
    		{year: req.params.year},
    		{month: req.params.month},
    		{day: req.params.day}
    	]
    };
    // should be 0 or 1 result
    DailyDataRecord.find(query)
    .then(docs => {
		if (docs.length < 1 || !docs) res.status(404).send('Not Found');
		else res.send(docs);
   	})
    .catch(err => console.log(err))
});

router.post('/:user_id/:year/:month/:day', (req, res) => {
    const query = {
    	$and: [
    		{user_id: req.params.user_id},
    		{year: req.params.year},
    		{month: req.params.month},
    		{day: req.params.day}
    	]
    };
    DailyDataRecord.find(query)
    .then(docs => {
		if (docs.length < 1 || !docs) {
			// TODO - validate user_id - check its valid object id and belongs to a user
		    const data_record = new DailyDataRecord({
		    	user_id: req.params.user_id,
	    		year: req.params.year,
	    		month: req.params.month,
	    		day: req.params.day,
	    		events_per_hour: req.body.events_per_hour
		    });
		    data_record.save()
		    .then(() => {
			    res.send(data_record);
		    })
		    .catch(err => {
		    	console.log(err);
		    	res.status(500).send('error');
		    });
	    }
	    else {
	    	DailyDataRecord.update(query,
	    			{ $set: { events_per_hour: req.body.events_per_hour }})
	    	.then((updated_record) => {
			    res.send(updated_record);
	    	})
	    }
   	})
    .catch(err => console.log(err))
});

// lazy update route, non RESTful
router.post('/update', (req, res) => {
    DailyDataRecord.find({$and: [ {email: req.body.email}, {day: req.body.day}]})
    .then(docs => {
		if (docs.length < 1 || !docs) {
		    const data_record = new DailyDataRecord(req.body);
		    data_record.save()
		    res.send(data_record);
	    }
	    else {
	    	DailyDataRecord.update({email: req.body.email, day: req.body.day},
	    			{ $set: { events_per_hour: req.body.events_per_hour }})
	    	.then((updated_record) => {
			    res.send(updated_record);
	    	})
	    }
   	})
    .catch(err => console.log(err))
});

module.exports = router;
