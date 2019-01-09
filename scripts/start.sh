#!/bin/bash

secret=$(head -c20 /dev/urandom | base64)

# if server restarts, all sessions get invalidated, but no risk of losing a secret to a hack though
export IS_DEV=1
export SESSION_SECRET=${secret}

node_modules/nodemon/bin/nodemon.js -L server.js # -L is for legacy mode, useful with vagrant apparently
