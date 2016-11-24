This repo has been cloned from the BlockchainInfrastructure repo as a base and refocused on Ethereum specific components.
Non Ethereum folders have been moved to seperate repos according to their focus.  

## Getting started ##

The instructions below detail two main ways for setting up an Ethereum node in your environment. There are other ways too, but you can do your own research into that as may be required. All instructions below will configure an instance of the Go based version (Geth) of Ethereum client. See full [Ethereum Install instructions](https://www.ethereum.org/cli) for using other clients.

### Using a preconfigured Docker image ###

The quickest way to get an Ethereum client node up and running is to use [Docker](https://docs.docker.com/engine/installation/) container technology and and preconfigured Ethereum image. 
These instructions are detailed in the [docker](https://github.com/springblock/Ethereum/tree/master/docker) folder of this repo. 
Located there are scripts that will get Docker based containers pulled onto your server.

### Manual Installation of an Ethereum environment ###

Manual installations are most easily accomplished on Ubuntu Linux (see below), but other environments are supported with differing levels of complexity involved. See full [Ethereum Install instructions](https://www.ethereum.org/cli)

[Installation Instructions for Ubuntu](https://github.com/ethereum/go-ethereum/wiki/Installation-Instructions-for-Ubuntu):

```
sudo apt-get install -y software-properties-common
sudo add-apt-repository -y ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install -y ethereum
```


## The Solidity Compiler ##

Solidity is a contract-oriented, high-level language whose syntax is similar to that of JavaScript and it is designed to target the Ethereum Virtual Machine.

[Solidity Documentation](https://solidity.readthedocs.io/en/latest/)

### Installing solidity on Ubuntu ###

```
sudo add-apt-repository ppa:ethereum/ethereum
sudo apt-get update
sudo apt-get install solc
```

[Other platforms](http://solidity.readthedocs.io/en/latest/installing-solidity.html#binary-packages)  

To check that all is well with your ethereum + solidity installation, run

```
$ geth console
> eth.getCompilers()
I0606 14:59:20.468976 common/compiler/solidity.go:114] solc, the solidity compiler commandline interface
Version: 0.3.4-0a0fc046/RelWithDebInfo-Linux/g++/Interpreter

path: /usr/local/bin/solc
["Solidity"]
```

## Starting an Ethereum node (Non Docker based) ##

These steps will outline getting an Ethereum node up and running with a bunch of defaults. The helper scripts will place all blockchain data in Blockchain/data and use a genesis block file Blockchain/genesisBlock.js. Open the helper scripts and genesisBlock.js in a text editor and have a look to see what they do.

0. Run ./createNewGenesisBlock.sh to create a new genesis block
1. Run the below to start a node. It will give the node a name of "TestNode", not connect to any peers and not start any mining.
```
./startEtherNode.sh TestNode
```

2. Run the following to create an account/address to mine to with password "password":
```
> personal.newAccount("password")
"<0x your account address>"
```

3. Quit by typing exit or Ctrl+D. This will stop the node from running.

4. Running the below will start the node, name it TestNode, and instruct it to mine with 1 cputhread to your address:
```
./startEtherNodeAndMine.sh <0x your account address> TestNode
```

5. You now have a node up and running that is mining to your account address. To check that all is well, open a new terminal window and run the following:
```
./attachToLocalEtherNode.sh
```

6. You now have a repl environment that is attached to the node started above. Run the following to check your eth balance:
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
In order to make the blockchain transactions a little more visible and easier to interact with, we are building a web ui that can run on top of the ethereum node.  
You will require node.js and npm in order to run the client.  Simply go to the WebClient folder and type: 
...
npm start
...
