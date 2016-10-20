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


# This script starts an interactive instance of the latest Ethereum Go client in a Docker vm
# The instance is preconfigured for the South African Blockchain network.

# Script name       : docker-geth-console.sh
# Author            : Gary De Beer (BankservAfrica)
# Last Modifiy Date : 18/10/2016 

#USAGE NOTES:
#===========

# This script is installed as part of springblock/BlockchainInfrastructure Git repo and requires all 
# files from that repo to be present in the path as configured in the $WORKDIR variable below. 

# This script can be used to perform the first time tasks of setting up a personal account and diagnostic testing.
# In this regard see the Git repo instruction step 2 under "Starting an Ethereum node"

# Please also make appropriate changes to the $NODEID, $NETID values below for your node.

# It is slso required to configure both the static-nodes.json and trusted-nodes.json files before any network
# connections can be etablished. These must be placed in the $CHAINDATA path specified below. 

"

