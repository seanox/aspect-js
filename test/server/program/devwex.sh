#!/bin/bash

options=-Dpath=$PATH
options="$options -Dlibraries=../libraries"

java -cp devwex.jar $options com.seanox.devwex.Service $1

echo
