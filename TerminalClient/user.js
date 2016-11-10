var accountManagement = require('../AccountManagement/accountManagement.js');
var etherDistribution = require('../EtherDistribution/etherDistribution.js');
var txCreator = require('../TransactionCreator/transactionCreator.js');
var userRegistry = require('../DataAccess/userRegistry.js');
var contractRegistry = require('../DataAccess/contractRegistry.js');
var balanceIssuance = require('../Issuance/balanceContract.js');
var cryptoZARIssuance = require('../Issuance/cryptoZARIssuance.js');
var util = require('../Util/util.js');
var config = require('../config.js');

var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.rpcaddress));

etherDistribution.StartEtherDistribution();

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function getNameOrAddress(cb){
  rl.question('Please enter a name or address: ', function(answer){
    var obj = {
      address: null,
      name: null
    }
    if(answer.indexOf('0x') >= 0 && answer.length == 42){
      obj.address = answer;
    } else {
      obj.name = answer;
    }
    cb(obj);
  });
}

function getNameAndPassword(cb){
  rl.question('Please enter a name: ', function(name){
    rl.question('Please enter a password: ', function(password){
      cb({
        name: name, 
        password: password
      });
    });
  });
}

function getValue(cb){
  rl.question('Please enter a value: ', function(value){
    cb(value);
  });
}

function getNameAndValue(cb){
  rl.question('Please enter a name: ', function(name){
    getValue(function(value){
      cb({
        name: name, 
        value: value
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
    cryptoZARIssuance.SubmitCryptoZARContract(balanceContract.address, function(xzaContract){
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

function handleIssungCryptoZAR(address, cb){
  var contractName = config.contractNames.cryptoZAR.name;
  var contractVersion = config.contractNames.cryptoZAR.version;
  getValue(function(sValue){
    var value = Number(sValue);
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
  });
}

var loggedInUser = null;

function handleNotLoggedInUser(cb){
  rl.question('What would you like to do: '+
    '\n1) Register new user'+
    '\n2) Login'+
    '\n0) Quit'+
    '\n> ', function(answer){
    if(answer == 0){
      console.log('Quiting');
      rl.close();
      userRegistry.CloseDB();
      return;
    } else if (answer == 1){ // Register new user
      getNameAndPassword(function(nameAndPassword){
        accountManagement.HandleUserRegistration(nameAndPassword, function(newUser){
          if(newUser){
            loggedInUser = nameAndPassword;
            loggedInUser.address = newUser.address;
            etherDistribution.AddAccountToWatch(loggedInUser.address, function(res){
              cb();
            });
          } else {
            console.log('\nUsername already taken. Please try again.\n');
            cb();
          }
        });      
      });
    } else if (answer == 2){ // Login         
      getNameAndPassword(function(nameAndPassword){
        accountManagement.Login(nameAndPassword.name, nameAndPassword.password, function(user){
          loggedInUser = user; 
            etherDistribution.AddAccountToWatch(loggedInUser.address, function(res){
              cb();
            });
        }); 
      });        
    } else {
      cb();
    }
  });
}

function handleLoggedInUser(cb){
  var displayUser = {
    name: loggedInUser.name,
    address: loggedInUser.address
  };
  console.log('\nUser:', displayUser.name);
  console.log('Address:', displayUser.address);
  rl.question('What would you like to do: '+
    '\n1) Send funds'+
    '\n2) Deploy Crypto ZAR contract'+
    '\n3) Get balance'+
    '\n4) Issue CryptoZAR'+
    '\n0) Log out'+
    '\n> ', function(answer){
    if(answer == 0){
      loggedInUser = null;
      cb(null);
    } else if (answer == 4){
      handleIssungCryptoZAR(loggedInUser.address, function(res){
        cb(res);
      }); 
    } else if (answer == 3){
      getNameOrAddress(function(nameOrAddress){
        var contractName = config.contractNames.cryptoZAR.balance.name;
        var contractVersion = config.contractNames.cryptoZAR.balance.version;
        contractRegistry.GetContract(contractName, contractVersion, function(contract){
          var xzaBalance = util.GetInstanceFromABI(contract.abi, contract.address);
          if(nameOrAddress.address != null){
            var balanceObj = xzaBalance.balanceOf(nameOrAddress.address);
            console.log('Balance:', balanceObj.c[0]);
            cb(null);
          } else {
            userRegistry.GetUser(nameOrAddress.name, function(user){
              var balanceObj = xzaBalance.balanceOf(user.address);
              console.log('Balance:', balanceObj.c[0]);
              cb(null);
            }); 
          }
        });
      });
    } else if (answer == 2){
      var ownerAddress = loggedInUser.address;
      deployCryptoZAR(ownerAddress, function(res){
        cb(res);
      });
    } else if (answer == 1){ // Send funds
      getNameAndValue(function(nameAndValue){
        userRegistry.GetUser(nameAndValue.name, function(toUser){
          if(nameAndValue.name.indexOf('0x') < 0 && toUser == null){
            console.log('ERROR: user not found:', nameAndValue.name);
            cb();
          } else {
            if(nameAndValue.name.indexOf('0x') >= 0){ // Is a valid address
              toUser = {
                address: nameAndValue.name
              }
            }
            var name = config.contractNames.cryptoZAR.name;
            var version = config.contractNames.cryptoZAR.version;
            contractRegistry.GetContract(name, version, function(contract){
              txCreator.GetRawContractTransfer(contract.abi, contract.address
                  , loggedInUser.address, toUser.address , nameAndValue.value, function(rawTx){
                accountManagement.SignRawTransaction(rawTx, loggedInUser.address
                  , loggedInUser.password, function(signedTx){
                  web3.eth.sendRawTransaction(signedTx, function(err, hash) {
                  if (err) {console.log('ERROR | SendRawTransaction:', err);}
                    console.log('Funds sent, tx hash:', hash);
                    cb();
                  });
                });
              });
            });
          }
        });
      });
    } else {
      cb();
    }
  });
}

function run(){
  if(loggedInUser == null){
    handleNotLoggedInUser(function(res){
      run();
    });
  } else {
    handleLoggedInUser(function(res){
      run();
    }); 
  }
}

run();
