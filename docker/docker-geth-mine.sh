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
The instance is preconfigured for the South African Blockchain network and will
perform just-in-time mining of eth to the specified coinbase account.

# Script name       : docker-geth-mine.sh
# Author            : Gary De Beer (BankservAfrica)
# Last Modifiy Date : 28/11/2016 

USAGE NOTES:
===========

This script is installed as part of the springblock/BlockchainInfrastructure Git repo and requires all 
files from that repo to be present in the path as configured in the $WORKDIR variable below.

Please make sure a Genesis block and Personal Account have been set up before you run this script for the first time.
See these scripts:
docker-geth-genesis.sh
docker-geth-console.sh 

Please make appropriate changes to the $NODEID, $NETID, $COINBASE values below for your node.

# It is still required to configure both static-nodes.json and trusted-nodes.json before any network
# connections can be etablished. These must be placed in the $CHAINDATA path specified below 

"

# remove any previous version of the docker image
docker rm geth

# get IPs from ifconfig and dig and display for information
LOCALIP=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | head -n1 | awk '{print $2}' | cut -d':' -f2)
IP=$(dig +short myip.opendns.com @resolver1.opendns.com)

echo "Local IP: $LOCALIP"
echo "Public IP: $IP"

#Set up operation parameters - change these as required
NODEID=Bankserv
NETID=44951
COINBASE="0x714abced09269d76896caf0555fdff644fbfae20"

#DO NOT CHANGE THESE VALUES
RPCPORT=20000
PORT=20010
AGENTORIGIN="http://41.76.226.170:3000"
CHAINDATA=/Ethereum/Blockchain/data
WORKDIR=/Ethereum
NODEPARAMS=" --identity $NODEID --rpc --rpcport $RPCPORT --datadir $CHAINDATA --port $PORT --networkid $NETID"
RPCCORS=" --rpccorsdomain $AGENTORIGIN"
MINEPARAMS=" --mine --etherbase $COINBASE --preload $WORKDIR/Blockchain/pauseMining.js"
OTHERPARAMS=" --autodag --fast --cache=512 --nat any --metrics --nodiscover --maxpeers 0 --verbosity 3"

# Display the settings being used on startup
echo "Startup parameters: (edit script to alter)"
echo "NODEID     = $NODEID"
echo "NETID      = $NETID"
echo "COINBASE   = $COINBASE"
echo "RPCPORT    = $RPCPORT"
echo "PORT       = $PORT"
echo "AGENTORIGIN= $AGENTORIGIN"
echo "WORKDIR    = $WORKDIR"
echo "CHAINDATA  = $CHAINDATA"
echo " "
echo " "
echo "GETH  CMD  = $NODEPARAMS"
echo "$RPCCORS"
echo "$MINEPARAMS"
echo "$OTHERPARAMS"

echo "Use this command to get a tailed output of the docker image output"

echo "docker logs -f geth"
echo " "
echo "To stop the node.."
echo "docker stop geth"


docker run -ti --name geth -v $WORKDIR:$WORKDIR \
    --network="host" -p $PORT:$PORT -p $RPCPORT:$RPCPORT \
    -w="$WORKDIR" \
    springblock/geth $NODEPARAMS $RPCCORS $MINEPARAMS $OTHERPARAMS \
    console
