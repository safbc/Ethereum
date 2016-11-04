var config = {};

config.dbConnectionString = 'springblock';
config.dbCollections = ['userRegistry', 'contractRegistry'];

config.contractNames = {
  cryptoZARBalance: 'cryptoZARBalance',
  cryptoZAR: 'cryptoZAR'
};

config.rpcaddress = 'http://localhost:20000';

module.exports = config;

