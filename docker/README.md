#Running in Docker

The Ethereum components (geth, solc etc) can all be run in preconfigured Docker containers on Linux and Mac OS X using these /bash scripts below. {Windows shell scripts comming soon}.

There is no need to install a local Ethereum client or compiler instance. 
Just edit and run these scripts to pull and start the relevant container with all our current standard parameters defined.

###*NOTE: The appropriate Docker Engine for your OS needs to be installed.*
See the Docker documentation at https://docs.docker.com/

####Super User privileges may be required (sudo)


##The scripts

###Build the container
This will take some time to download and process.
```
sudo docker build -t geth --pull --rm .
```

Only use this the first time to generate your new genesis block.
```
./docker-geth-genesis.sh
```

Use this for an interactive instance of the client (without mining) that can be used to set up accounts etc.
One can also ``attach`` to a running node using the standard 'attach' script `./.
```
./docker-geth-console.sh
```

This script will launch a background instance of the geth node with JIT mining enabled.
```
./docker-geth-mine.sh
```

####*NOTE: You need to edit edit each script before use to configure the appropriate parameters for your specific environment.*


##Behind the scenes

These scripts will download (only the first time) and launch the latest container for each and:
  * bind it to the host OS IP address
  * open the required network ports (20000, 20010)
  * mount a local folder for persisting this node's blockchain data (/BlockchainInfrastructure/Blockchain/data)
  
Please add the current static-nodes.json and trusted-nodes.json files to this local folder.


##Network monitoring

```
./docker-agent.sh
```

This script will can be used to run a docker image of the Ethereum Network Intelligence API (https://github.com/cubedro/eth-net-intelligence-api) agent that is configured to upload your node stats to the Springblock network monitoring dashboard. 

Please edit the sample ``/BlockchainInfrastructure/ethnetintel/app.json`` file as per your own requirements before using this script.

You can access the dashboard at http://41.76.226.170:3000/


##Compiling Solidity Contracts

```
./docker-eth-solc.sh /<path>/<yourcontract.sol>
```

This will compile the specified Solidity contract file. **You must specifiy the full path to your contract file.**
The compiler output will found in `/BlockchainInfrastructure/Contracts/Output`

##Upgrading your Docker Images & Ethereum version

###Linux

Apart from keeping your Linux host up to date with patches and security updates there will also be a requirement to update 
the Ethereum components and their containers as well. This can be achived in one of two ways.

  * Performing an internal software update.
  * Rebuilding the container image

###Updating internal software

```
sudo docker exec geth apt-get update
sudo docker exec geth apt-get upgrade
sudo docker stop geth
sudo docker start geth
```

###Rebuilding the container

If there are major revisions to the docker container (new OS version or docker file changes) it may be desirable to pull 
or rebuild the container from scratch.

Procedures for doing this will be largely dependant on your own Docker configuration (using orchestration or not), but the
process should basically involve.

*1 Stopping the running container*
```
sudo docker stop geth
```
*2 Rebuild the container (pulling newer versions if available)*
```
sudo docker build -t geth --pull --rm .
```

##Other helpfull Docker commands

Display all containers on your system.
```
docker ps -a
```

This will display the output (non interactive) of the background container.
```
docker logs -f geth
```

Generate a detailed report (json formatted) of the current configuration of the docker container. 
```
docker inspect geth
```

This will stop the running geth node
```
docker stop geth
```




