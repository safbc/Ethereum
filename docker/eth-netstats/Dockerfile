FROM node:latest

RUN git clone https://github.com/cubedro/eth-netstats
RUN cd /eth-netstats && npm install
RUN cd /eth-netstats && npm install -g grunt-cli
RUN cd /eth-netstats && grunt
RUN cd /eth-netstats && echo '#!/bin/bash\nset -e\n\ncd /eth-netstats\nWS_SECRET=SpringblockGeheim npm start\n' > /eth-netstats/startscript.sh
RUN cd /eth-netstats && chmod +x /eth-netstats/startscript.sh

WORKDIR /eth-netstats
EXPOSE 3000
CMD ["./startscript.sh"]
