#!/bin/bash

title=$1
artist=$2
thumb=$3

curl -XPOST -H "Content-type: application/json" -d \
'{"title": "'"$title"'", "artist": "'"$artist"'", "thumb": "'"$thumb"'"}' \
'127.0.0.1:4000/releases'