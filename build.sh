#!/bin/bash

echo "#########################################"
echo "########## Building api docker ##########"
echo "#########################################"
cd api
docker build -t turn_data:latest .

echo "########################################"
echo "########## Building ui docker ##########"
echo "########################################"
cd ../ui
docker build -t turn_react:latest .

cd ..
echo "#########################################"
echo "####### Finished building dockers #######"
echo "#########################################"
