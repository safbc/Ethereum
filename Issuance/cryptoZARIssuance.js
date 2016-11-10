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

// This function needs to move to a central location
function deployCryptoZAR(ownerAddress, cb){
  // First submit contract from web3.eth.coinbase (until 
  // issue #9 (https://github.com/springblock/BlockchainInfrastructure/issues/9) is resolved)
  // and then transfer to ownerAddress
  web3.eth.defaultAccount = web3.eth.coinbase;
  balanceIssuance.SubmitContract(web3.eth.coinbase, 0, function(balanceContract){

    web3.eth.defaultAccount = web3.eth.coinbase;
    submitCryptoZARContract(balanceContract.address, function(xzaContract){
      // Add the balance contract to the contract registry
      balanceContract.name = config.contractNames.cryptoZAR.balance.name;
      balanceContract.version = config.contractNames.cryptoZAR.balance.version;
      contractRegistry.AddContract(balanceContract, function(res){
        // Add the crypto ZAR contract to the contract registry
        xzaContract.name = config.contractNames.cryptoZAR.name;
        xzaContract.version = config.contractNames.cryptoZAR.version;
        contractRegistry.AddContract(xzaContract, function(res){

          var xza = util.GetInstanceFromABI(xzaContract.abi, xzaContract.address);
          // Change the owner of the balance contract to the xzaContract.address
          var balanceContractInstance = util.GetInstanceFromABI(balanceContract.abi
            , balanceContract.address);

          // Once we are able to deploy the contract from the transaction creator we can use the 
          // estimate gas method here
          balanceContractInstance.transferOwnership(xzaContract.address, {gas: 100000, gasPrice:1});
          // Change owner of the xza contract to the ownerAddress
          var xzaContractInstance = util.GetInstanceFromABI(xzaContract.abi, xzaContract.address);
          xzaContractInstance
            .transferOwnership(ownerAddress, {gas: 100000, gasPrice:1}, function(err, res){
            cb();
          });
        });
      });
    });
  });
}

function getBalance(address, cb){
  var contractName = config.contractNames.cryptoZAR.balance.name;
  var contractVersion = config.contractNames.cryptoZAR.balance.version;
  contractRegistry.GetContract(contractName, contractVersion, function(contract){
    var xzaBalance = util.GetInstanceFromABI(contract.abi, contract.address);
    var balanceObj = xzaBalance.balanceOf(address);
    cb(balanceObj);
  });
}

exports.DeployCryptoZARContract = deployCryptoZAR;
exports.HandleIssungCryptoZAR = handleIssungCryptoZAR;
exports.GetBalance = getBalance;
