#!/bin/bash
# a wrapper around

readonly data_path="$HOME"

mongod --dbpath="${data_path}/data"
