#!/bin/bash

# This script is used to validate application 
sleep 3

ipaddr=$(curl http://api.dev.shakyav.me/latest/meta-data/local-ipv4)
listencount=$(netstat -an | grep 8080 | grep LISTEN | wc -l)

if [ "$listencount" -lt 1 ]; then
    exit 1
else
    exit 0
fi