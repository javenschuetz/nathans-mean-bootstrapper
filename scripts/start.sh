#!/bin/bash

secret=$(head -c20 /dev/urandom | base64)

BACKBONE_SECRET=${secret} node_modules/nodemon/bin/nodemon.js server.js
