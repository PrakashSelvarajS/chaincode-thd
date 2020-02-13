# TheHomeDepot Chaincode
> Chaincode for TheHomeDepot dispute management application

# Prerequisites

# Getting started
- Clone this repo into a folder called "chaincode"
  > git clone git@github.ibm.com:THDPoC/chaincode.git chaincode
- Load the project in VS Code
- Install all dependencies using NPM from the VS Code terminal 
  > npm install
- Ensure that all code passes basic unit tests
  > npm run test

# Deploying your chaincode to a local blockchain
- Make sure you have the "blockchainAPI" repo cloned into a folder next to your "chaincode" folder
- Make sure you have a local Fabric environment running 
  > (from the blockchainAPI folder) run "npm run start-blockchain"
- Deploy your chaincode to the local Fabric environment by running the deploy.sh script form the VS Code terminal
  > ./deploy.sh
- If you need to redeploy your chaincode, just run the deploy.sh script again and it will take care of updating Fabric with a new version

# Monitoring your current network
- Run a "watch" command from a new terminal window 
  > watch -n 1 "docker ps --format 'table {{.ID}}\t{{.Status}}\t{{.Names}}'"
