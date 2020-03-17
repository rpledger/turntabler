#!/bin/bash

user_id=$1
release_id=$2

curl -XPOST -H "Content-type: application/json" -d \
'{"release_id": "'"$release_id"'", "user_id": "'"$user_id"'"}' \
'127.0.0.1:4000/listens'