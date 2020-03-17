#!/bin/bash

id=$1
username=$2
email=$3

echo $id

curl -XPOST -H "Content-type: application/json" -d \
'{"id": "'"$id"'", "username": "'"$username"'", "email": "'"$email"'"}' \
'127.0.0.1:4000/users'