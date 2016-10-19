#Running in Docker

The Ethereum components (geth, solc etc) can all be run in preconfigured Docker containers on Linux and Mac OS X using these /bash scripts below. {Windows shell scripts comming soon}.

There is no need to install a local Ethereum client or compiler instance. 
Just edit and run these scripts to pull and start the relevant container with all our current standard parameters defined.

###The appropriate Docker Engine for your OS needs to be installed.
See the Docker documentation at https://docs.docker.com/

####Admin privileges may be required (sudo)


##New scripts

``./docker-geth-genesis.sh`` 

Only use this the first time to generate your new genesis block.

``./docker-geth-console.sh``

Use this for an interactive instance of the client (without mining) that can be used to set up accounts etc.
One can also ``attach`` to a running node using the standard 'attach' script `./.

``./docker-geth-mine.sh``

This script will launch a background instance of the geth node with JIT mining enabled.

####You need to edit edit each script before use to configure the appropriate parameters for your specific environment.


##Behind the scenes

These scripts will download (only the first time) and launch the latest container for each and:
  * bind it to the host OS IP address
  * open the required network ports (20000, 20010)
  * mount a local folder for persisting this node's blockchain data (/BlockchainInfrastructure/Blockchain/data)
  
Please add the current static-nodes.json and trusted-nodes.json files to this local folder.


##Network monitoring

``./docker-agent.sh``

This script will can be used to run a docker image of the Ethereum Network Intelligence API (https://github.com/cubedro/eth-net-intelligence-api) agent that is configured to upload your node stats to the Springblock network monitoring dashboard. 

Please edit the sample ``/BlockchainInfrastructure/ethnetintel/app.json`` file as per your own requirements before using this script.

You can access the dashboard at http://41.76.226.170:3000/


##Compiling Solidity Contracts

``./docker-eth-solc.sh /<path>/<yourcontract.sol>``

This will compile the specified Solidity contract file. **You must specifiy the full path to your contract file.**
The compiler output will found in `/BlockchainInfrastructure/Contracts/Output`


##Helpfull Docker commands

``docker ps -a``

Display all containers on your system.

``docker logs -f springblocknode``

This will display the output (non interactive) of the background container.

``docker inspect springblocknode``

Generate a detailed report (json formatted) of the current configuration of the docker container. 

``docker stop springblocknode``

This will stop the background springblock node


