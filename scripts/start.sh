#!/bin/bash

secret=$(head -c20 /dev/urandom | base64)

export IS_DEV=1
export BACKBONE_SECRET=${secret}

node_modules/nodemon/bin/nodemon.js -L server.js
