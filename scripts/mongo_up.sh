#!/bin/bash

# starts the mongo daemon
	# - in the background
	# - stores the db data at the dbpath
	# - outputs logs to the logpath

sudo mongod --fork --logpath /var/log/mongod.log --dbpath="/data"
