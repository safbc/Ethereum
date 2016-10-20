echo "
Welcome to

  _____ ____  ____   ____  ____    ____  ____   _       ___     __  __  _ 
 / ___/|    \|    \ |    ||    \  /    ||    \ | |     /   \   /  ]|  |/ ]
(   \_ |  o  )  D  ) |  | |  _  ||   __||  o  )| |    |     | /  / |  ' / 
 \__  ||   _/|    /  |  | |  |  ||  |  ||     || |___ |  O  |/  /  |    \ 
 /  \ ||  |  |    \  |  | |  |  ||  |_ ||  O  ||     ||     /   \_ |     
 \    ||  |  |  .  \ |  | |  |  ||     ||     ||     ||     \     ||  .  |
  \___||__|  |__|\_||____||__|__||___,_||_____||_____| \___/ \____||__|\_|


The South African Private Blockchain Network

Start a  Dockerised instance of the Ethnetintel agent

# Script Name    : docker-agent.sh
# Author         : Gary de Beer (BankservAfrica)
# Last Modified  : 20/10/2016

NOTE:
=====
You need to make the appropriate changes to your own copy of the app.json file

A sample file can be found in /Blockchaininfrastructure/ethnetintel/app.json

"

#Remove previous image
docker rm ethnetintel

#DO NOT CHANGE THESE VALUES
CHAINDATA=/BlockchainInfrastructure/Blockchain/data
WORKDIR=/BlockchainInfrastructure
GENISISPARAMS=" --datadir $CHAINDATA init $WORKDIR/Blockchain/genesisBlock.json"

# Display the settings being used on startup
echo "Startup parameters: "
echo "WORKDIR    = $WORKDIR"

docker run -d --name ethnetintel \
    -v $WORKDIR/ethnetintel/app.json:/home/ethnetintel/eth-net-intelligence-api/app.json \
    --network host \
    ethnetintel:latest

echo "To view the container log output: (press CTRL+C to quit log view)"
echo "docker logs -f ethnetintel"

