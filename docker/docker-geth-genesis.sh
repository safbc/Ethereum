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


This script starts an instance of the latest Ethereum Go client in a Docker vm
and will generate a Genesis block for a new chain.

# Script Name     : docker-geth-genesis.sh
# Author          : Gary De Beer (BankservAfrica)
# Last Modified   : 20/10/2016 

USAGE NOTES:
===========

This script is installed as part of springblock/BlockchainInfrastructure Git repo and requires all 
files from that repo to be present in the path as configured in the $WORKDIR variable below. 


IMPORTANT!!!!!
==============
This script will REMOVE ALL FILES in the $CHAINDATA path specified below.
A new enode value will also be generated so remember to update your entry in the published
trusted-node.json and static-nodes.json files.

"

# remove any previous version of the docker image
docker rm springblocknode

# get IPs from ifconfig and dig and display for information
#LOCALIP=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | head -n1 | awk '{print $2}' | cut -d':' -f2)
#IP=$(dig +short myip.opendns.com @resolver1.opendns.com)

#echo "Local IP: $LOCALIP"
#echo "Public IP: $IP"

#DO NOT CHANGE THESE VALUES
CHAINDATA=/BlockchainInfrastructure/Blockchain/data
WORKDIR=/BlockchainInfrastructure
GENESISPARAMS=" --datadir $CHAINDATA init $WORKDIR/Blockchain/genesisBlock.json"

# Display the settings being used on startup
echo "Startup parameters: (edit script to alter)"
echo "WORKDIR    = $WORKDIR"
echo "CHAINDATA  = $CHAINDATA"
echo " "
echo " "
echo "GETH  CMD  = $GENESISPARAMS"

rm -rf $CHAINDATA
mkdir $CHAINDATA

docker run -t -i --name springblocknode -v $WORKDIR:$WORKDIR \
    --network="host" \
    -w="$WORKDIR" \
    ethereum/client-go $GENESISPARAMS
