#! /bin/bash

delay=30
[[ $(uname -m) == arm* ]] && delay=60
echo "initializing replset if necessary... in ${delay} seconds"
sleep ${delay}

echo "${delay} seconds elapsed; checking for replset..."
mongo $SNAP/bin/initmongoreplset.js
