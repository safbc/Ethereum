## Dockerfile for eth-net-intelligence-api (build from git).
## Includes customisations for pushing stats to the springblocks eth-stats website http://41.76.226.170:3000
## Build via:
#
# `docker build -t spethnetintel:latest .`
#
## Run via:
#
# `docker run -d --name ethnetintel \
# -v /BlockchainInfrastructure/monitoring/app.json:/home/ethnetintel/eth-net-intelligence-api/app.json \
# --network host \
# spethnetintel:latest`
#
## Make sure, to mount your configured 'app.json' into the container at
## '/home/ethnetintel/eth-net-intelligence-api/app.json', e.g.
## '-v /path/to/app.json:/home/ethnetintel/eth-net-intelligence-api/app.json'
## 
## I have included a sample app.json in the /BlockchainInfrastructure/monitoring folder.
## Make your own appropriate customizations and then use the run command as below.
##
## Note: if you actually want to monitor a client, you'll need to make sure it can be reached from this container.
##       I have managed to get this to work by running the container in host network mode (default for docker is bridged mode)
##       ie. start this container with the '--network host' option.
##       You may have to also need to specify the geth option --rpccorsdomain "http://127.0.0.1:3000" to grant the website access 
##       via the monitoring agent.
##       Warning: This may conflict with running your own web rpcapi frontends though.
##
## Note 2: You may require network rules to allow outbound connections on port 3000 to publish your stats to the website
##
# Run the above with -t -i (instead of -d) to see the output of the agent for diagnostic info if required
# You should see something like this...
#
#2016-09-11 20:46 +00:00: [eth] =i= Starting web3 connection
#2016-09-11 20:46 +00:00: [eth] =✓= Web3 connection established
#2016-09-11 20:46 +00:00: [eth] ==> Getting info
#2016-09-11 20:46 +00:00: [eth] =i= { name: 'YourNodeName',
#  contact: 'Yourname',
#  coinbase: '0x99999999999999999999999999999999',
#  node: 'Geth/v1.4.11-stable/linux/go1.5.1/YourNodeName',
#  net: '44951',
#  protocol: 63,
#  api: '0.15.3',
#  port: '20010',
#  os: 'linux',
#  os_v: '4.4.0-36-generic',
#  client: '0.1.1',
#  canUpdateHistory: true }


FROM debian

RUN apt-get update &&\
    apt-get install -y curl git-core &&\
    curl -sL https://deb.nodesource.com/setup | bash - &&\
    apt-get update &&\
    apt-get install -y nodejs

RUN apt-get update &&\
    apt-get install -y build-essential

RUN adduser ethnetintel

RUN cd /home/ethnetintel &&\
    git clone https://github.com/cubedro/eth-net-intelligence-api &&\
    cd eth-net-intelligence-api &&\
    npm install &&\
    npm install -g pm2

RUN echo '#!/bin/bash\nset -e\n\ncd /home/ethnetintel/eth-net-intelligence-api\n/usr/bin/pm2 start ./app.json\ntail -f \
    /home/ethnetintel/.pm2/logs/node-app-out-0.log' > /home/ethnetintel/startscript.sh

RUN chmod +x /home/ethnetintel/startscript.sh &&\
    chown -R ethnetintel. /home/ethnetintel

USER ethnetintel
ENTRYPOINT ["/home/ethnetintel/startscript.sh"]
