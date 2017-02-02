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
# Script name       : docker-ethnetstats.sh
# Author            : Gary De Beer (BankservAfrica)
# Last Modifiy Date : 03/02/2017 
#USAGE NOTES:
===========
This script is installed as part of springblock/Ethereum Git repo and requires all 
files from that repo to be present in the path as configured in the $WORKDIR variable below. 
This script can be used to perform the task of building and starting a docker instance of
the Ethereum Stats Dashboard.

This should only be run on one server as all other nodes should report into just the one instance.
"

# remove any previous version of the docker image
docker rm ethnetstats

# get IPs from ifconfig and dig and display for information
LOCALIP=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | head -n1 | awk '{print $2}' | cut -d':' -f2)
IP=$(dig +short myip.opendns.com @resolver1.opendns.com)

echo "Local IP: $LOCALIP"
echo "Public IP: $IP"

#DO NOT CHANGE THESE VALUES
PORT=3000

#This is the stats webserver details
AGENTORIGIN="http://$IP:$PORT"
HOSTDIR="/Ethereum/eth-netstats"
WORKDIR="/eth-netstats"
OTHERPARAMS=" "

# Display the settings being used on startup
echo "Startup parameters: (edit script to alter)"
echo "PORT       = $PORT"
echo "AGENTORIGIN= $AGENTORIGIN"
echo " "
echo " "
echo "$OTHERPARAMS"

echo " 
Starting up dashboard at $AGENTORIGIN
"
docker run -it --name ethnetstats -v $HOSTDIR:$WORKDIR \
 +    --network="host" \
 +    -p $PORT:$PORT \
 +    springblock/ethnetstats $OTHERPARAMS \
