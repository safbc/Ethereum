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
sudo apt-get -y install libcryptopp-dev libjson-rpc-cpp-dev

cd ~
git clone --recursive https://github.com/ethereum/webthree-umbrella.git
cd webthree-umbrella
./webthree-helpers/scripts/ethupdate.sh --no-push --simple-pull --project solidity # update Solidity repo
./webthree-helpers/scripts/ethbuild.sh --no-git --project solidity --cores 4 -DEVMJIT=0 -DETHASHCL=0 # build Solidity only
```

### Installing NodeJS ###

