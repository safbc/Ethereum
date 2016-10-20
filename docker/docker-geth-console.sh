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


This script starts an interactive instance of the latest Ethereum Go client in a Docker vm
The instance is preconfigured for the South African Blockchain network.

# Script name       : docker-geth-console.sh
# Author            : Gary De Beer (BankservAfrica)
# Last Modifiy Date : 20/10/2016 

#USAGE NOTES:
===========

This script is installed as part of springblock/BlockchainInfrastructure Git repo and requires all 
files from that repo to be present in the path as configured in the $WORKDIR variable below. 

This script can be used to perform the first time tasks of setting up a personal account and diagnostic testing.
In this regard see the Git repo instruction step 2 under "Starting an Ethereum node"

Example:
To create you personal account enter at the console prompt.

>personal.newAccount("a-good-password")
<0x your account address>

Please also make appropriate changes to the $NODEID, $NETID values below for your node.

It is slso required to configure both the static-nodes.json and trusted-nodes.json files before any network
connections can be etablished. These must be placed in the $CHAINDATA path specified below. 

"

# remove any previous version of the docker image
docker rm springblocknode

# get IPs from ifconfig and dig and display for information
#LOCALIP=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | head -n1 | awk '{print $2}' | cut -d':' -f2)
#IP=$(dig +short myip.opendns.com @resolver1.opendns.com)

#echo "Local IP: $LOCALIP"
#echo "Public IP: $IP"

#Set up operation parameters - change these as required
NODEID=Bankserv
NETID=44951

#DO NOT CHANGE THESE VALUES
RPCPORT=20000
PORT=20010
#This is the stats webserver details
AGENTORIGIN="http://41.76.226.170:3000"
 
CHAINDATA=/BlockchainInfrastructure/Blockchain/data
WORKDIR=/BlockchainInfrastructure
NODEPARAMS=" --identity $NODEID --rpc --rpcport $RPCPORT --datadir $CHAINDATA --port $PORT --networkid $NETID"
RPCCORS=" --rpccorsdomain $AGENTORIGIN"
OTHERPARAMS=" --autodag --cache=512 --nat any --metrics --nodiscover --maxpeers 0 --verbosity 6"

# Display the settings being used on startup
echo "Startup parameters: (edit script to alter)"
echo "NODEID     = $NODEID"
echo "NETID      = $NETID"
echo "RPCPORT    = $RPCPORT"
echo "PORT       = $PORT"
echo "AGENTORIGIN= $AGENTORIGIN"
echo "WORKDIR    = $WORKDIR"
echo "CHAINDATA  = $CHAINDATA"
echo " "
echo " "
echo "GETH CMD   = geth $NODEPARAMS"
echo "$RPCCORS"
echo "$OTHERPARAMS"

echo " 

Starting up node...

"
docker run -it --name springblocknode -v $WORKDIR:$WORKDIR \
    --network="host" \
    -p $PORT:$PORT -p $RPCPORT:$RPCPORT \
    -w="$WORKDIR" \
    ethereum/client-go $NODEPARAMS $RPCCORS $OTHERPARAMS \
    console
