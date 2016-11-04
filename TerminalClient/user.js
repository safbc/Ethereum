var accountManagement = require('../AccountManagement/accountManagement.js');
var etherDistribution = require('../EtherDistribution/etherDistribution.js');
var txCreator = require('../TransactionCreator/transactionCreator.js');
var userRegistry = require('../DataAccess/userRegistry.js');
var contractRegistry = require('../DataAccess/contractRegistry.js');
var balanceIssuance = require('../Issuance/balanceContract.js');
var cryptoZARIssuance = require('../Issuance/cryptoZARIssuance.js');

var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.rpcaddress));

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

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

function getNameAndvalue(cb){
  rl.question('Please enter a name: ', function(name){
    rl.question('Please enter a value: ', function(value){
      cb({
        name: name, 
        value: value
      });
    });
  });
}

function issueCryptoZAR(ownerAddress, cb){
  balanceIssuance.SubmitContract(ownerAddress, 0, function(balanceContract){
    web3.eth.defaultAccount = ownerAddress;
    cryptoZARIssuance.SubmitCryptoZARContract(balanceContract.address, function(xzaContract){
      balanceContract.name = config.assets.cryptoZARBalance;
      contractRegistry.AddContractToRegistry(balanceContract, function(res){
        xzaContract.name = config.assets.cryptoZAR;
        contractRegistry.AddContractToRegistry(xzaContract, function(res){
          cb();
        });
      }); 
      //var xza = util.GetInstanceFromABI(xzaContract.abi, xzaContract.address);
      // Change the owner of tha balance contract to the xzaContract.address
      //var balanceContractInstance = util.GetInstanceFromABI(balanceContract.abi
      //  , balanceContract.address);
      
      //balanceContractInstance.transferOwnership(xzaContract.address, {gas: 100000, gasPrice:1});
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
    '\n2) Issue Crypto ZAR'+
    '\n0) Log out'+
    '\n> ', function(answer){
    if(answer == 0){
      loggedInUser = null;
      run();
    } else if (answer == 2){
      issueCryptoZAR(loggedInUser.address, function(res){
        cb(res);
      });
    } else if (answer == 1){ // Send funds
      getNameAndvalue(function(nameAndValue){
        userRegistry.GetUser(nameAndValue.name, function(toUser){
          if(toUser == null){
            console.log('ERROR: user not found:', nameAndValue.name);
            cb();
          } else {
            var rawTx = txCreator.GetRawSendEther(loggedInUser.address, toUser.address
              , nameAndValue.value);
            accountManagement.SignRawTransaction(rawTx, loggedInUser.address, loggedInUser.password
              , function(signedTx){
              console.log('signedTx:', signedTx);
              web3.eth.sendRawTransaction(signedTx, function(err, hash) {
              if (err) {console.log('ERROR|SendRawTransaction:', err);}
                console.log('Funds sent, tx hash:', hash);
                cb();
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
  etherDistribution.StartEtherDistribution();
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
