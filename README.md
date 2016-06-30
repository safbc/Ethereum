## Getting started ##

### Intalling Ethereum ###

[Installation Instructions for Ubuntu 14.04](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu):

```
#!bash

sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo add-apt-repository -y ppa:ethereum/ethereum-dev
sudo apt-get update
sudo apt-get install -y ethereum
```


### Installing Solidity ###

[Installing Solidity on Ubuntu 14.04](http://solidity.readthedocs.io/en/latest/installing-solidity.html):

```
#!bash

sudo apt-get -y install build-essential git cmake libgmp-dev libboost-all-dev \
    libjsoncpp-dev libleveldb-dev libcurl4-openssl-dev libminiupnpc-dev \
    libmicrohttpd-dev

sudo add-apt-repository -y ppa:ethereum/ethereum
sudo add-apt-repository -y ppa:ethereum/ethereum-dev
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

[Installing Solidity on Mac El Capitan](http://solidity.readthedocs.io/en/latest/installing-solidity.html):

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

```

To check that all is well with your ethereum + solidity installation, run


```
#!bash
$ geth console 
> eth.getCompilers()
I0606 14:59:20.468976 common/compiler/solidity.go:114] solc, the solidity compiler commandline interface
Version: 0.3.4-0a0fc046/RelWithDebInfo-Linux/g++/Interpreter

path: /usr/local/bin/solc
["Solidity"]
```

### Starting an Ethereum node ###

These steps will outline getting an Ethereum node up and running with a bunch of defaults. The helper scripts will place all blockchain data in Blockchain/data and use a genesis block file Blockchain/genesisBlock.js. Open the helper scripts and genesisBlock.js in a text editor and have a look to see what they do.

1.Run the below to start a node. It will give the node a name of "TestNode", not connect to any peers and not start any mining.
```
#!bash
./startEtherNode.sh TestNode
```

2.Run the following to create an account/address to mine to with password "password":
```
#!bash
> personal.newAccount("password")
"<0x your account address>"
```

3.Quit by typing exit or Ctrl+D. This will stop the node from running.

4.Running the below will start the node, name it TestNode, and instruct it to mine with 1 cputhread to address <0x your account address>:

```
#!bash

./startEtherNodeAndMine.sh <0x your account address> TestNode
```

Note: install cpulimit on linux to manage the cpu utilisation of this process.

5.You now have a node up and running that is mining to <0x your account address>. To check that all is well, open a new terminal window and run the following:
```
#!bash

./attachToLocalEtherNode.sh
```

6.You now have a repl environment that is attached to the node started above. Run the following to check your eth balance:
```
#!bash

> eth.getBalance(eth.coinbase)
1.53e+21
```