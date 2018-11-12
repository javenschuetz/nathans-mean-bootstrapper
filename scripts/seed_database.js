#!/usr/bin/env node

// this script is to initialize an empty mongo database with some dummy data
//    note: the script is NOT idempotent

const mongo_client = require('mongodb').MongoClient;
const db_name = 'backbone-db';
const url = `mongodb://localhost:27017/${db_name}`;

function create_db_and_collections(cb) {
    mongo_client.connect(url, function(err, db) {
        if (err) return cb(err);
        const dbo = db.db(db_name);

        dbo.createCollection('users', function(err, res) {
            if (err) return cb(err);
            console.log('users collection created!');

            dbo.createCollection('posture_data', function(err, res) {
                if (err) return cb(err);
                console.log('posture_data collection created!');
                db.close();
                return cb(null);
            });
        });
    });
}

function seed_users(cb) {
    mongo_client.connect(url, function(err, db) {
        if (err) return cb(err);
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
        const dbo = db.db(db_name);

        dbo.collection('users').insertMany(seeded_users, function(err, res) {
            if (err) return cb(err);
            console.log(`Inserted ${res.insertedCount} documents`);
            db.close();
            return cb(null);
        });
    });
}

function seed_posture_data(cb) {
    mongo_client.connect(url, function(err, db) {
        if (err) return cb(err);

        const seeded_posture_data = [{
            user_email: 'banjo@jones.ca',
            period_length: 'snapshot',
            measurements: []
        }];

        // fill in some random measurement data
        for (let i = 0; i < 100; i++) {
            seeded_posture_data[0].measurements.push(
                {
                    // subtract 0-10% from the date. Hopefully this is reasonable?
                    period_end_timestamp: new Date().getTime() -
                            Math.random() * new Date().getTime() * .1,
                    position_class: 'good'
                }
            );
            seeded_posture_data[0].measurements.push(
                {
                    // subtract 0-10% from the date. Hopefully this is reasonable?
                    period_end_timestamp: new Date().getTime() -
                            Math.random() * new Date().getTime() * .1,
                    position_class: 'bad'
                }
            );
        }

        const dbo = db.db(db_name);
        dbo.collection('posture_data').insertMany(seeded_posture_data, function(err, res) {
            if (err) return cb(err);
            console.log(`Inserted ${res.insertedCount} documents`);
            db.close();
            return cb(null);
        });
    });
}

if (require.main === module) {
    create_db_and_collections((err) => {
        if (err) throw new Error(err);

        seed_users((err) => {
            if (err) throw new Error(err);

            seed_posture_data((err) => {
                if (err) throw new Error(err);
                console.log('\n\nDatabase seeded');
            })
        });
    })
}
