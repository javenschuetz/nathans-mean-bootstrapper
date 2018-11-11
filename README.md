# README

The server code of Team Backbone's Posture monitoring wearable

## Starting and Stopping things

Start the server in server mode
	`npm run serve`

Start the server in dev mode
	`npm start`

Start mongo
	`sudo scripts/start_mongo.sh`

Stop mongo
	`sudo service mongod stop`

Restart mongo
	`sudo service mongod restart`

## Dev Environment setup

1. clone git repo
2. run install script (does not yet exist)
	- install nodejs
	- install npm (should come with node)
	- install nodemon globally via npm
	- `npm install nodemon --global`

3. set up ssh config file
	```
	Host backbone-server
	    HostName 100.24.164.212
	    User ubuntu
	    Port 22
	    IdentityFile "~/.ssh/<your ssh key>"
	```
	- you can now connect via 'ssh backbone-server'
	- IdentityFile may be unnecessary if you provide your usual public key
	- you can call Host whatever you want, its just a name for your own use
4. download Robo3T (used to work with mongo conveniently)
	- put the directory somewhere convenient (/home/foo/installations/robo3t works)
	- skip filling our your info
	- create .local/share/applications/robo3T.desktop and setup shortcuts
	- if scaling of the ui is an issue, there is a qt command line variable you
	  can set in .profile (iirc).
	- todo: fill in details for setting up robo3T

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
	todo: stash this code on s3 and use the cli to grab it
6. start mongo (instructions above)

[1] make new database ebs
1. create 8GB encrypted ebs
	- todo: decide if a non-default key is better
2. attach to an instance
	note: the instance seems to be able to auto-decrypt it
3. format it to an ext4 filesystem
4. mount in '~/data' directory
	- todo: change this to /data
	- note: leave owner as 'root'
5. config mongo to use this storage device
	- make sure the script at scripts/start_mongo.sh is executable
