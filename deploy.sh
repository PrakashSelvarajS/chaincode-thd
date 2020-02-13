#!/bin/bash

# exit if we encounter any errors
#set -e

# set the Fabric configuration path for all the binaries to use later
export FABRIC_CFG_PATH=./config

# build the chaincode
echo "Building the chaincode"
npm run build

# deploy the chaincode using the CLI docker container
echo "Deploying the chaincode"
docker exec thd-cli ./chainman.sh deployChaincode

echo "Chaincode deployment is complete"