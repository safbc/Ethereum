``` work in progress

#Running in Docker

The geth client can be run as a clean Docker image (latest build). Choose one of the distros below.
One could also fork your own Docker off of these and customise it further as required.

###Ubuntu 14.04 (158 MB):
```docker pull ethereum/client-go:trusty```

###Ubuntu 16.04 (180MB)
```docker pull ethereum/client-go:xenial```

###Alpine Linux (35 MB):
```docker pull ethereum/client-go:alpine```

##New scripts
For our purposes we can then use these alternate scripts to initialise and then start it in mining or non-mining mode. Apart from the ```genisis``` and ```attach``` scripts, the containers will be run in the background.

The scripts will launch the container and:
  * bind it to the host IP address (--network host)
  * open the various network ports (-p ...)
  * mount a local folder for storing the blockchain data (-v ...)
  
Please add the current static-nodes.json and trusted-nodes.json files to this local folder.




