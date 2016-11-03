var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

function getTokenInstance(contractSource, contractAddress){
  var compiled = web3.eth.compile.solidity(contractSource);
  var abi = compiled.Token.info.abiDefinition;
  var tokenContract_ = web3.eth.contract(abi);
  var token = tokenContract_.at(contractAddress);
  return token;
}

function getInstanceFromABI(contractABI, contractAddress){
  var contract = web3.eth.contract(contractABI);
  return contract.at(contractAddress);
}

function prefundAndUnlockAccount(account, password, cb){
  web3.eth.sendTransaction({from:web3.eth.coinbase, to:account, value:20000000}, function(err, res){
    if(err){console.log('ERROR:', err);}
    unlockAccount(account, password, function(res){
      cb(res);
    });
  });
}

function unlockAccount(account, password, cb){
  web3.personal.unlockAccount(account, password, 10*60, function(err, res2){
    if(err){console.log('ERROR:', err);}
    cb();
  });
}

exports.GetTokenInstance = getTokenInstance;
exports.GetInstanceFromABI = getInstanceFromABI;
exports.UnlockAccount = unlockAccount;
exports.PrefundAndUnlockAccount = prefundAndUnlockAccount;

