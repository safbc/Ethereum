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


# This script starts an instance of the latest Ethereum Go client in a Docker vm
# and will generate a Genesis block for a new chain.

# Script Name      : docker-geth-genesis.sh
# Author           : Gary De Beer (BankservAfrica)
# Last Modifiy Date: 28/11/2016 

#USAGE NOTES:
#===========

This script is installed as part of Springblocks/Blockchaininfrastructure Git repo and requires all 
files from that repo to be present in the path as configured in the $WORKDIR variable below. 

IMPORTANT!!!!!
==============
This script will REMOVE ALL FILES in the $CHAINDATA path specified below 
"


# remove any previous version of the docker image
docker rm geth

#DO NOT CHANGE THESE VALUES
CHAINDATA=/Ethereum/Blockchain/data
WORKDIR=/Ethereum
GENESISPARAMS=" --datadir $CHAINDATA init $WORKDIR/Blockchain/genesisBlock.json"

# Display the settings being used on startup
echo "Startup parameters: (edit script to alter)"
echo "WORKDIR    = $WORKDIR"
echo "CHAINDATA  = $CHAINDATA"
echo " "
echo " "
echo "GETH  CMD  = geth $GENESISPARAMS"

echo "Backig up current static & trusted nodes files"
mkdir $WORKDIR/backup
cp $CHAINDATA/*.json $WORKDIR/backup

echo "Deleting current blockchain data"
rm -rf $CHAINDATA
mkdir $CHAINDATA
echo "Restoring static & trusted node files. Please update these files once the new enode is generated."
cp $WORKDIR/backup/*.json $CHAINDATA
rm -rf $WORKDIR/backup

echo "Starting the geth container"
docker run -t -i --name geth -v $WORKDIR:$WORKDIR \
    --network="host" \
    -w="$WORKDIR" \
    sprinblock/geth $GENESISPARAMS
