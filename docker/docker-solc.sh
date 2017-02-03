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



This is an Ethereum Solidity compiler image, allowing you to compile contracts on any platform that supports Docker.

# Script name   : docker-solc.sh
# Author        : Gary de Beer (BankservAfrica)
# Last modified : 20/10/2016

This script is installed as part of springblock/BlockchainInfrastructure Git repo and requires all
files from that repo to be present in the path as configured in the $WORKDIR variable below.

Quick start
===========
To invoke the solidity compiler, solc, you can simply run the container:

docker run mrhornsby/solc:latest
(Note: This will print the standard usage instructions)

To compile a contract you will run this script along with the full path name of the soldity contract 
file you want to compile.

 ./docker-eth-solc.sh <yoursoliditycontract>.sol

(Note: This will output both the ABI and the contract binary in hex, feel free to select other options as required)

"

# get IPs from ifconfig and dig and display for information
LOCALIP=$(ifconfig | grep 'inet ' | grep -v '127.0.0.1' | head -n1 | awk '{print $2}' | cut -d':' -f2)
IP=$(dig +short myip.opendns.com @resolver1.opendns.com)

echo "Local IP: $LOCALIP"
echo "Public IP: $IP"

#DO NOT CHANGE THESE VALUES
WORKDIR=/BlockchainInfrastructure
OUTPUT=$WORKDIR/Contracts/Output

# Display the settings being used on startup
echo "Startup parameters: (edit script to alter)"
echo "CONTRACT   = $1"
echo "OUTPUT     = $OUTPUT"

if [ ! -d "$OUTPUT" ]; then
mkdir $OUTPUT
fi

docker run --name springblocksolc -v $WORKDIR:$WORKDIR --rm \
   mrhornsby/solc:latest -o $OUTPUT --abi --bin $1

ls -l $OUTPUT
