#!/bin/bash
export CITY=$1
export STATE=$2

docker-compose up  --build --remove-orphans --force-recreate mass_prop_run

