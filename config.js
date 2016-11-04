var config = {};

config.dbConnectionString = 'springblock';
config.dbCollections = ['userRegistry', 'contractRegistry'];

config.contractNames = {
  cryptoZAR: {
    version: 1,
    name: 'cryptoZAR',
    balance: {
      version: 1,
      name: 'cryptoZARBalance'
    }
  }
};

config.rpcaddress = 'http://localhost:20000';

module.exports = config;

