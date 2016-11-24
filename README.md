This repo has been cloned from the BlockchainInfrastructure repo as a base and refocused on Ethereum specific components.
Non Ethereum folders have been moved to seperate repos according to their focus.  

## Getting started ##

For a really quick start see the [docker](https://github.com/springblock/BlockchainInfrastructure/tree/master/docker) folder for scripts that will get Docker based containers on your server.

### Intalling Ethereum ###

[Installation Instructions for Ubuntu 14.04](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu):

```
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum
```


### Installing Solidity on Ubuntu###

[Installing Solidity on Ubuntu 14.04](http://solidity.readthedocs.io/en/latest/installing-solidity.html):
* references to the webthree-umbrella are out of date. This repo has been deprecated *
```
sudo apt-get -y install build-essential git cmake libgmp-dev libboost-all-dev \
    libjsoncpp-dev libleveldb-dev libcurl4-openssl-dev libminiupnpc-dev \
    libmicrohttpd-dev

sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get -y update
sudo apt-get -y upgrade # this will update cmake to version 3.x
sudo apt-get -y install libcryptopp-dev libjson-rpc-cpp-dev # for ubuntu versions prior to 15.10
sudo apt-get -y install libcryptopp-dev libjsonrpccpp-dev # for ubuntu versions 15.10+

cd ~
git clone --recursive https://github.com/ethereum/webthree-umbrella.git
cd webthree-umbrella
./webthree-helpers/scripts/ethupdate.sh --no-push --simple-pull --project solidity # update Solidity repo
./webthree-helpers/scripts/ethbuild.sh --no-git --project solidity --cores 4 -DEVMJIT=0 -DETHASHCL=0 # build Solidity only

sudo ln -s ~/webthree-umbrella/solidity/build/solc/solc /usr/local/bin/
```

[Installing solidity on Ubuntu 16.04](http://solidity.readthedocs.io/en/latest/installing-solidity.html)  *This may also work on 14.04 - not tested*
```
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install solc
```

### Installing Solidity on Mac El Capitan###
[Installing Solidity on Mac El Capitan](http://solidity.readthedocs.io/en/latest/installing-solidity.html):

```
brew update
brew upgrade

brew install boost --c++11             # this takes a while
brew install cmake cryptopp miniupnpc leveldb gmp libmicrohttpd libjson-rpc-cpp
# For Mix IDE and Alethzero only
brew install xz d-bus
brew install homebrew/versions/v8-315
brew install llvm --HEAD --with-clang
brew install qt5 --with-d-bus          # add --verbose if long waits with a stale screen drive you crazy as well

git clone --recursive https://github.com/ethereum/webthree-umbrella.git
cd webthree-umbrella
./webthree-helpers/scripts/ethupdate.sh --no-push --simple-pull --project solidity # update Solidity repo
./webthree-helpers/scripts/ethbuild.sh --no-git --project solidity --cores 4 -DEVMJIT=0 -DETHASHCL=0 # build Solidity only

sudo ln -s ~/webthree-umbrella/solidity/build/solc/solc /usr/local/bin/

```

To check that all is well with your ethereum + solidity installation, run


```
$ geth console
> eth.getCompilers()
I0606 14:59:20.468976 common/compiler/solidity.go:114] solc, the solidity compiler commandline interface
Version: 0.3.4-0a0fc046/RelWithDebInfo-Linux/g++/Interpreter

path: /usr/local/bin/solc
["Solidity"]
```

### Starting an Ethereum node ###

These steps will outline getting an Ethereum node up and running with a bunch of defaults. The helper scripts will place all blockchain data in Blockchain/data and use a genesis block file Blockchain/genesisBlock.js. Open the helper scripts and genesisBlock.js in a text editor and have a look to see what they do.

0. Run ./createNewGenesisBlock.sh to create a new genesis block

1.Run the below to start a node. It will give the node a name of "TestNode", not connect to any peers and not start any mining.
```
./startEtherNode.sh TestNode
```

2.Run the following to create an account/address to mine to with password "password":
```
> personal.newAccount("password")
"<0x your account address>"
```

3.Quit by typing exit or Ctrl+D. This will stop the node from running.

4.Running the below will start the node, name it TestNode, and instruct it to mine with 1 cputhread to address <0x your account address>:

```
./startEtherNodeAndMine.sh <0x your account address> TestNode
```

Note: install cpulimit on linux to manage the cpu utilisation of this process.

5.You now have a node up and running that is mining to <0x your account address>. To check that all is well, open a new terminal window and run the following:
```
./attachToLocalEtherNode.sh
```

6.You now have a repl environment that is attached to the node started above. Run the following to check your eth balance:
```
> eth.getBalance(eth.coinbase)
1.53e+21
```
## Setting up the private network ##

### Introduction ###
The springblock network is a private ethereum network.  Please read this to get a background on ethereum networks and how the connectivity between the nodes works (https://github.com/ethereum/go-ethereum/wiki/Connecting-to-the-network)

The springblock network is designed as a test network for South Africa.  The aim is to make it inclusive for any approved financial institution.  In order to keep the network connected we will be using static-nodes.json and trusted-nodes.json.

This ensures that if ever a node disconnects for any reason, it will immediately attempt to reconnect to the trusted nodes.  This creates a level of robustness on the network.

### Monitoring the network ###

See the [docker](https://github.com/springblock/BlockchainInfrastructure/tree/master/docker) folder for the ``docker-agent.sh`` script that will start a Docker container with a version of the [https://github.com/cubedro/eth-net-intelligence-api](https://github.com/cubedro/eth-net-intelligence-api) RPC monitoring agent.

This agent will publish the collected data to the private eth-stats website dashboard at (http://41.76.226.170:3000).

## Running the web client ##
In order to make the blockchain transactions a little more visible and easier to interact with, we are building a web ui that can run on top of the ethereum node.  You will require node.js and npm in order to run the client.  Simple go to the WebClient folder and type npm start
