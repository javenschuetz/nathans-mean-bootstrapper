#!/usr/bin/env node

const MongoClient = require('mongodb').MongoClient;
const db_name = "backbone-db";
const url = `mongodb://localhost:27017/${db_name}`;

function create_db_and_collections(cb) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db(db_name);
        dbo.createCollection("users", function(err, res) {
            if (err) throw err;
            console.log("users collection created!");

            dbo.createCollection("posture_data", function(err, res) {
                if (err) throw err;
                console.log("posture_data collection created!");

                db.close();
                return cb(null);
            });
        });
    });
}

function seed_users(cb) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db(db_name);

        const seeded_users = [
            {
                email: 'banjo@jones.ca',
                account_status: 'active',
                password_hash: '123'
            },
            {
                email: 'mail@nathanschuetz.ca',
                account_status: 'active',
                password_hash: '123'
            },
            {
                email: 'bandit@anarchist.pwn',
                account_status: 'inactive',
                password_hash: '123'
            }
        ];
        dbo.collection("users").insertMany(seeded_users, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
            return cb(null);
        });
    });
}

function seed_posture_data(cb) {
    MongoClient.connect(url, function(err, db) {
        if (err) throw err;
        const dbo = db.db(db_name);

        const seeded_posture_data = [{
            user_email: 'banjo@jones.ca',
            period_length: "snapshot",
            measurements: []
        }];

        for (let i = 0; i < 100; i++) {
            seeded_posture_data[0].measurements.push(
                {
                    period_end_timestamp: new Date().getTime() -
                            Math.random() * new Date().getTime() * .1,
                    position_class: "good"
                }
            );
            seeded_posture_data[0].measurements.push(
                {
                    period_end_timestamp: new Date().getTime() -
                            Math.random() * new Date().getTime() * .1,
                    position_class: "bad"
                }
            );
        }

        dbo.collection("posture_data").insertMany(seeded_posture_data, function(err, res) {
            if (err) throw err;
            console.log("Number of documents inserted: " + res.insertedCount);
            db.close();
            return cb(null);
        });
    });
}

if (require.main === module) {
    create_db_and_collections((err) => {
        seed_users((err) => {
            seed_posture_data((err) => {
                console.log('did it work?');
            })
        });
    })
}
