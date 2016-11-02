var async = require('async');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

var newBlockEvents = require('../Events/newBlockEvents.js');
var events = require('../Events/eventEmitter.js');

var minimumBalance = 100000;
var defaultBalance = 200000;
var accounts = {};

function addAccountToWatch(account, cb){
  accounts[account] = defaultBalance;
  checkAndFundAccount(account, function(res){
    cb(res);
  });
}

function removeAccountFromWatchList(account){
  accounts[account] = 0;
  delete accounts[accounts];
}

function checkAndFundAccount(address, cb){
  web3.eth.getBalance(address, function(err, balance){
    if(err){console.log('ERROR:', err)}
    console.log('checkAndFundAccount:', address, '| balance:', balance.c[0]);
    if(balance.c[0] < minimumBalance){
      var value = accounts[address] - balance.c[0];
      var tx = {
        from: web3.eth.coinbase,
        to: address,
        value: value
      };
      web3.eth.sendTransaction(tx, function(err, txHash){
        cb(null);
      });
    } else {
      cb(null);
    }
  }); 
}

function startEtherDistribution(){
  newBlockEvents.Start();
  web3.personal.unlockAccount(web3.eth.coinbase, '1234', 9999999, function(err, res){
  });
  events.on('newBlock', function(blockHash, intent){
    web3.eth.getBlock(blockHash, function(err, block){
      if(intent == 'latest' && block.transactions && block.transactions.length > 0){
        async.each(block.transactions, function(txid, cb){
          web3.eth.getTransaction(txid, function(err, txDetail){
            if(err){console.log('ERROR:', err)}
            if(accounts[txDetail.from] && accounts[txDetail.from] > 0){
              checkAndFundAccount(txDetail.from, function(res){
                cb(res);
              });
            } else {
              cb(null);
            }
          });
        }, function(err){
          if(err){console.log('ERROR:', err)}
        });
      }
    }); 
  }); 
}

exports.MinimumBalance = minimumBalance;
exports.DefaultBalance = defaultBalance;
exports.AddAccountToWatch = addAccountToWatch;
exports.RemoveAccountFromWatchList = removeAccountFromWatchList;
exports.StartEtherDistribution = startEtherDistribution;
