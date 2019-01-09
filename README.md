# README

The server code of a MEAN app skeleton, by Nathan Schuetz. For bootstrappig web
app projects.

# Dev Environment setup

#### set up virtual machine & vagrant
1. Download & install Virtual Box
2. Download & install Vagrant (see below for some commands)
3. Clone the git repository to some directory
4. use `vagrant ssh` when within the directory in your terminal to enter the vm
5. the project directory is mounted at `/vagrant`
6. `cd scripts/init_machine`
7. execute the init_machine script
8. if necessary, run `npm install`

#### other setup
1. Set up ssh config file
	```
	Host my-server
	    HostName <ip address>
	    User ubuntu
	    Port 22
	    IdentityFile "~/.ssh/<file containing your ssh key>"
	    LocalForward 37017 127.0.0.1:27017
	    AddressFamily inet
	```
	- notes
		- addressfamily inet prevents ipv6, which messes up port forwarding
		- localforward is for mongo
		- ubuntu is default username for an ubuntu EC2 instance
	- you can now connect via 'ssh my-server'
	- IdentityFile may be unnecessary if you get your usual public key into the
	  authorized keys section of the server
	- you can call Host whatever you want, its just a name for your own use
2. install & configure robo3T
	- `sudo snap install robo3t-snap`
	- create a connection called 'my-computer' with address `localhost:27017`.
	  This is for connecting to the db on your own machine.
	- create a connection called 'my-server' with address `localhost:37017`
	  This is for connecting to the database on the server.


# Server set up

1. create ec2 instance (t2 micro or other cheap type)
2. security groups:
	- allow http/https from everywhere
	- allow ssh from anywhere (for now)
	- allow icmp for echo requests (just so that ping works during testing)
3. ebs
	- mount an 8GB gp2 for root device
	- mount the database ebs, or make a new one for the db[1]
4. vpc
	- use the default one (for now)
5. use rsync to transfer the code over
	- `rsync -avzhe ssh node-skeleton-app/ my-server:~/node-skeleton-app`
	- todo: use some CI tool to stash this code on s3 and use the cli to grab it
	- todo: use more appropriate directory in /opt for the code
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
	- make sure the script at scripts/mongo_up.sh is executable
6. seed the db with some dummy data (for now)
	- `node scripts/seed_database.js`
	- this script is not idempotent and should not be run more than once
	- todo - this script is out of date currently (jan 2019)

# Appendix

#### Starting and Stopping things

Start the server in server mode: `npm run serve`
	- you can ctrl-c out of this a few seconds later since its using a module
	  called 'forever' to run

Start the server in local dev mode (use this except for prod server)
	- `npm start`

mongo
	- start: `sudo scripts/mongo_up.sh`
	- stop: find the pid and kill it


#### some vagrant commands

`vagrant up` - start a vm

`vagrant halt` - force stop vm without deleting it

`vagrant suspend` - like halt, but graceful and not forced

`vagrant ssh` - ssh into a vm

`vagrant destroy` - delete a vm

`vagrant status` -get status of vms
