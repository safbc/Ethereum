# This script starts an instance of the latest Ethereum Go client in a Docker vm
# and will generate a Genesis block for a new chain.

# Script Name      : docker-geth-genesis.sh
# Author           : Gary De Beer (BankservAfrica)
# Last Modifiy Date: 18/10/2016 

#USAGE NOTES:
#===========

# This script is installed as part of Springblocks/Blockchaininfrastructure Git repo and requires all 
# files from that repo to be present in the path as configured in the $WORKDIR variable below. 

# IMPORTANT!!!!!
# ==============
# This script will REMOVE ALL FILES in the $CHAINDATA path specified below 


# remove any previous version of the docker image
docker rm springblocknode

#DO NOT CHANGE THESE VALUES
CHAINDATA=/BlockchainInfrastructure/Blockchain/data
WORKDIR=/BlockchainInfrastructure
GENISISPARAMS=" --datadir $CHAINDATA init $WORKDIR/Blockchain/genesisBlock.json"

# Display the settings being used on startup
echo "Startup parameters: (edit script to alter)"
echo "WORKDIR    = $WORKDIR"
echo "CHAINDATA  = $CHAINDATA"
echo " "
echo " "
echo "GETH  CMD  = $GENESISPARAMS"

docker run -t -i --name springblocknode -v $WORKDIR:$WORKDIR \
    --network="host" \
    -w="$WORKDIR" \
    ethereum/client-go $GENESISPARAMS
