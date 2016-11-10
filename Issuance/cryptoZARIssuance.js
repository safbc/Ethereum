var accountManagement = require('../AccountManagement/accountManagement.js');
var txCreator = require('../TransactionCreator/transactionCreator.js');
var contractRegistry = require('../DataAccess/contractRegistry.js');
var config = require('../config.js');

var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

function submitCryptoZARContract(balanceContractAddress, cb){
  var rootDirectory = __dirname.replace("Issuance", "");
  var filePath = rootDirectory + 'Contracts/cryptoZAR.sol';
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

function handleIssungCryptoZAR(loggedInUser, value, cb){
  var contractName = config.contractNames.cryptoZAR.name;
  var contractVersion = config.contractNames.cryptoZAR.version;
  contractRegistry.GetContract(contractName, contractVersion, function(xzaContract){
    txCreator.AdjustOwnerBalance(xzaContract.abi, xzaContract.address, loggedInUser.address, value
        , function(rawTx){
      accountManagement.SignRawTransaction(rawTx, loggedInUser.address, loggedInUser.password
          , function(signedTx){
        web3.eth.sendRawTransaction(signedTx, function(err, hash) {
        if (err) {console.log('ERROR | SendRawTransaction:', err);}
          cb(hash);
        });
      });
    });
  });
}

exports.SubmitCryptoZARContract = submitCryptoZARContract;
exports.HandleIssungCryptoZAR = handleIssungCryptoZAR;
