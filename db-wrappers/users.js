'use strict';

// A wrapper around the users collection in mongo
// ******************************************************************** requires
const mongo_client = require('mongodb').MongoClient;
const db_name = 'backbone-db';
const url = `mongodb://localhost:27017/${db_name}`;


// ********************************************************************* exports
module.exports.find_user = (email, cb) => {
    mongo_client.connect(url, function(err, db) {
        if (err) return cb(err);
        const dbo = db.db(db_name);

        dbo.collection('users').findOne({'email': email}, (err, user) => {
            if (err) return cb(err);
            db.close();
            return cb(null, user);
        });
    });
}
