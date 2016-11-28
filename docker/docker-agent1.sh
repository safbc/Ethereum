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
# Last Modified  : 25/11/2016

NOTE:
=====


"

#Remove previous image
docker rm ethnetintel

#DO NOT CHANGE THESE VALUES
CHAINDATA=/Ethereum/Blockchain/data
WORKDIR=/Ethereum
GENISISPARAMS=" --datadir $CHAINDATA init $WORKDIR/Blockchain/genesisBlock.json"

# Display the settings being used on startup
echo "Startup parameters: "
echo "WORKDIR    = $WORKDIR"

docker run -d --network host -e NAME_PREFIX="Bankserv" \
-e WS_SERVER="http://localhost:3000" -e WS_SECRET="SpringblockGeheim" \
-e RPC_HOST="localhost" -e RPC_PORT="20000" \
--name ethnetintel ethnetintel

#docker run -d --name ethnetintel \
#    -v $WORKDIR/ethnetintel/app.json:/home/ethnetintel/eth-net-intelligence-api/app.json \
#    --network host \
#    ethnetintel:latest

echo "To view the container log output: (press CTRL+C to quit log view)"
echo "docker logs -f ethnetintel"

