# README

The server code of Team Backbone's Posture monitoring wearable

## Starting and Stopping things

Start the server in server mode
`npm run serve`

Start the server in dev mode
`npm start`

## Environment set up

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

## Server set up

1. set up the server in aws
2. use rsync to transfer the code over
