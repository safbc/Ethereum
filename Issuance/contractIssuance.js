var accountManagement = require('../AccountManagement/accountManagement.js');
var txCreator = require('../TransactionCreator/transactionCreator.js');
var contractRegistry = require('../DataAccess/contractRegistry.js');
var balanceIssuance = require('../Issuance/balanceContract.js');
var util = require('../Util/util.js');
var config = require('../config.js');

var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

function submitTokenContract(balanceContractAddress, cb){
  var rootDirectory = __dirname.replace("Issuance", "");
  var filePath = rootDirectory + 'Contracts/token.sol';
  fs.readFile(filePath, 'utf8', function(err, source){
    if(err){console.log("ERROR:", err);}
    var compiled = web3.eth.compile.solidity(source);
    var code = compiled.Token.code;
    var abi = compiled.Token.info.abiDefinition;

    var contractData = web3.eth.contract(abi).new.getData({data: code});
    var estimatedGas = web3.eth.estimateGas({data: contractData});

    web3.eth.contract(abi).new(balanceContractAddress, 
      {data: code, gas: estimatedGas + 3*30000, gasPrice: 1}, function (err, contract) { 
      if(err) {
        console.error("ERROR:", err);   // Log any errors
        cb();
      } else if(contract.address){  
        console.log('Contract mined, address: ' + contract.address);
        cb({
          address: contract.address,
          abi: abi
        });
      }
    });
  });
}

function deployToken(ownerAddress, tokenName, initialIssuance, cb){
  // First submit contract from web3.eth.coinbase (until 
  // issue #9 (https://github.com/springblock/BlockchainInfrastructure/issues/9) is resolved)
  // and then transfer to ownerAddress
  web3.eth.defaultAccount = web3.eth.coinbase;
  balanceIssuance.SubmitContract(web3.eth.coinbase, initialIssuance, function(balanceContract){

    web3.eth.defaultAccount = web3.eth.coinbase;
    submitTokenContract(balanceContract.address, function(tokenContract){
      // Add the balance contract to the contract registry
      balanceContract.name = tokenName + 'Balance';
      balanceContract.version = 1;
      contractRegistry.AddContract(balanceContract, function(res){
        // Add the crypto ZAR contract to the contract registry
        tokenContract.name = tokenName;
        tokenContract.version = 1;
        contractRegistry.AddContract(tokenContract, function(res){

          var token = util.GetInstanceFromABI(tokenContract.abi, tokenContract.address);
          // Change the owner of the balance contract to the tokenContract.address
          var balanceContractInstance = util.GetInstanceFromABI(balanceContract.abi
            , balanceContract.address);

          // Once we are able to deploy the contract from the transaction creator we can use the 
          // estimate gas method here
          balanceContractInstance.transferOwnership(tokenContract.address, {gas: 100000, gasPrice:1});
          // Change owner of the token contract to the ownerAddress
          var tokenContractInstance = util.GetInstanceFromABI(tokenContract.abi, tokenContract.address);
          tokenContractInstance.transferOwnership(ownerAddress, {gas: 100000, gasPrice:1}, function(err, res){
            //TODO: handle errors correctly here
            tokenContractInstance.transfer(ownerAddress, initialIssuance, function(err, res){
              cb();
            });
          });
        });
      });
    });
  });
}

function getBalance(address, contractName, cb){
  var contractVersion = 1; //TODO This needs to be fixed as per issue #11 https://github.com/springblock/BlockchainInfrastructure/issues/11
  contractName += 'Balance';
  contractRegistry.GetContract(contractName, contractVersion, function(contract){
    var balance = util.GetInstanceFromABI(contract.abi, contract.address);
    var balanceObj = balance.balanceOf(address);
    cb(balanceObj);
  });
}

function sendFunds(userAddress, userPassword, toAddress, contractName, value, cb){
  var version = 1; //TODO This needs to be fixed as per issue #11 https://github.com/springblock/BlockchainInfrastructure/issues/11
  contractRegistry.GetContract(contractName, version, function(contract){
    txCreator.GetRawContractTransfer(contract.abi, contract.address, userAddress, toAddress 
        , value, function(rawTx){
      accountManagement.SignRawTransaction(rawTx, userAddress, userPassword
          , function(signedTx){
        web3.eth.sendRawTransaction(signedTx, function(err, hash) {
        if (err) {console.log('ERROR | SendRawTransaction:', err);}
          cb(hash);
        });
      });
    });
  });
}

exports.DeployToken = deployToken;
exports.GetBalance = getBalance;
exports.Send = sendFunds;
