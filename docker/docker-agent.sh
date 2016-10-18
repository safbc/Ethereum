#Start a  Dockerised instance of the Ethnetintel agent

#NOTE:
#You need to make the appropriate changes to your own copy of the app.json file
#A sample file can be found in /Blockchaininfrastructure/ethnetintel/app.json


#Remove previous image
docker rm ethnetintel

docker run -d --name ethnetintel -v /BlockchainInfrastructure/ethnetintel/app.json:/home/ethnetintel/eth-net-intelligence-api/app.json --network host ethnetintel:latest
