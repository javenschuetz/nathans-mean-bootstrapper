# README

The server code of Team Backbone's Posture monitoring wearable

## Starting and Stopping things

Start the server in server mode
	- `npm run serve`
	- you can ctrl-c out of this a few seconds later since its using a module
	  called 'forever' to run

Start the server in dev mode
	- `npm start`

mongo
	- start: `sudo scripts/start_mongo.sh`
	- stop: ctrl-c (or find the pid and kill it)
	- todo: use services or systemd

## Dev Environment setup

1. clone git repo
1.5. go to init machine directory, THEN execute init machine.sh
2. install npm modules
	- `npm install`
3. set up ssh config file
	```
	Host backbone-server
	    HostName 100.24.164.212
	    User ubuntu
	    Port 22
	    IdentityFile "~/.ssh/<file containing your ssh key>"
	    LocalForward 37017 127.0.0.1:27017
	    AddressFamily inet
	```
	- you can now connect via 'ssh backbone-server'
	- IdentityFile may be unnecessary if you get your usual public key into the
	  authorized keys section of the server
	- you can call Host whatever you want, its just a name for your own use
4. install & configure robo3T
	- `sudo snap install robo3t-snap`
	- create a connection called 'my-computer' with address `localhost:27017`.
	  This is for connecting to the db on your own machine.
	- create a connection called 'backbone-server' with address `localhost:37017`
	  This is for connecting to the database on the server.


## Server set up

1. create ec2 instance (t2 micro or other cheap type)
2. security groups:
	- allow http/https from everywhere
	- allow ssh from anywhere (for now)
	- allow icmp for echo requests (so ping works during testing)
3. ebs
	- mount an 8GB gp2 for root device
	- mount the database ebs, or make a new one for the db[1]
4. vpc
	- use the default one (for now)
5. use rsync to transfer the code over
	- `rsync -avzhe ssh team-backbone-server/ backbone-server:~/team-backbone-server`
	- todo: use some CI tool to stash this code on s3 and use the cli to grab it
6. start mongo (instructions above)

1.5. go to init machine directory, THEN execute init machine.sh

[1] make new database ebs (if necessary)
1. create 8GB encrypted ebs
	- todo: decide if a non-default key is better
2. attach to an instance
	- note: the instance seems to be able to auto-decrypt it
3. format it to an ext4 filesystem
4. mount in '~/data' directory
	- todo: change this to /data
	- note: leave owner as 'root'
		- todo: create a mongodb user instead?
5. config mongo to use this storage device
	- make sure the script at scripts/start_mongo.sh is executable
6. seed the db with some dummy data (for now)
	- `node scripts/seed_database.js`
	- this script is not idempotent and should not be run more than once


# setup on windows

1. Microsoft Store - download Ubuntu 18.04 LTS
2. install windows subsystem for linux
3. set up ssh keys and then clone git repo
4. continue as above
