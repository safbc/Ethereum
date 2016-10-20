# Run a public IPFS node in a docker container

# Script Name    : docker-ipfs.sh
# Author         : Gary de Beer (BankservAfrica)
# Last Modified  : 20/20/2016

# USAGE
# -----



docker rm ipfspublic

# ENVIRONMENT SETTINGS
# ====================

WORKDIR=/BlockchainInfrastructure/ipfs
STAGING=$WORKDIR/staging
IPFSDATA=$WORKDIR/data

if [ ! -d "$WORKDIR" ]; then
sudo mkdir $WORKDIR
sudo mkdir $STAGING
sudo mkdir $IPFSDATA
sudo chmod -R 777 $WORKDIR
fi

# initialise ipfs on first run
if [ ! -f "$IPFSDATA/version" ]; then
docker run -it --rm --name ipfspublic -v $IPFSDATA:/data/ipfs --network=host ipfs/go-ipfs --init
fi


docker run -d --name ipfspublic \
       -v $STAGING:/export \
       -v $IPFSDATA:/data/ipfs \
       --network=host \
       -p 8080:8080 -p 4001:4001 -p 5001:5001 \
       ipfs/go-ipfs 


docker logs -f ipfspublic

docker exec ipfspublic ipfs id

