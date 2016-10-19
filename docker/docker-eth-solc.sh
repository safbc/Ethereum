#This is an Ethereum Solidity compiler image, allowing you to compile contracts on any platform that supports Docker.

# Script name   : docker-eth-solc.sh
# Author        : Gary de Beer (BankservAfrica)
# Last modified : 19/10/2016

# This script is installed as part of springblock/BlockchainInfrastructure Git repo and requires all
# files from that repo to be present in the path as configured in the $WORKDIR variable below.

# Quick start
# ===========
# To invoke the solidity compiler, solc, you can simply run the container:

# docker run mrhornsby/solc:latest
# (Note: This will print the standard usage instructions)

# To compile a contract you will run this script along with the name (no path) of the soldity contract file you want to compile.
# This script assumes all contract files will be placed in the BlockchainInfrastructure/Contracts folder.

# ./docker-eth-solc.sh <yoursoliditycontract>.sol

# (Note: This will output both the ABI and the contract binary in hex, feel free to select other options as required)

docker rm springblocksolc

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

docker run --name springblocksolc -v $WORKDIR:$WORKDIR \
   mrhornsby/solc:latest -o $OUTPUT --abi --bin $1

ls -l $OUTPUT
