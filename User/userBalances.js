var async = require('async');

var cryptoZARRegistry = require('../DataAccess/cryptoZARRegistry.js');
var cryptoZARIssuance = require('../Issuance/cryptoZARIssuance.js');
var util = require('../Util/util.js');
var eventEmitter = require('../BlockChainViewer/eventEmitter.js');
var config = require('../config.js');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.rpcaddress));

var coinbasePassword = '1234';

function migrateBalance(token, accountAddress, cb){
  console.log('Migrating user balance for account:', accountAddress);
  web3.personal.unlockAccount(web3.eth.coinbase, coinbasePassword, 60*60*24*365, function(err, res){
    if (err) {console.log('ERROR in migrateBalance:', err);}
    var oldAccount = web3.eth.defaultAccount;
    web3.eth.defaultAccount = web3.eth.coinbase;
    if(token.migrateBalance){ // Checks that this function exists
      token.migrateBalance(accountAddress);
    }
    web3.eth.defaultAccount = oldAccount;
    eventEmitter.once('newBlock', function(blockHeight){
      var balanceInfo = token.balanceOf(accountAddress);
      var addressBalance = util.ConvertToUnitCurrency(util.SumBalance(balanceInfo));
      cb(addressBalance);
    });
  });
}

function getUserCryptoZARBalance(accountAddressRepo, cb){
  cryptoZARIssuance.GetCryptoZARTokenInstance(function(token){
    if(token){
      async.mapSeries(accountAddressRepo, function(account, callback){ 
        if(token.balanceMigrated(account.address) == false){
          migrateBalance(token, account.address, function(addressBalance){
            callback(null, addressBalance);
          });
        } else {
          var balanceInfo = token.balanceOf(account.address);
          var addressBalance = util.ConvertToUnitCurrency(util.SumBalance(balanceInfo));
          callback(null, addressBalance);
        }  
      }, function(err, results){
        if(err){
          console.log('ERROR getting balances:', err);
          cb(0);
        } else {
          cb(util.SumArrayValues(results)); 
        }
      })
    } else {
      cb(0);       
    }
  });
}

function getAddressCryptoZARBalance(accountAddress, cb){
  var list = [{address: accountAddress}];
  getUserCryptoZARBalance(list, function(balance){
    cb(balance);  
  });
}

exports.GetUserCryptoZARBalance = getUserCryptoZARBalance;
exports.GetAddressCryptoZARBalance = getAddressCryptoZARBalance;

