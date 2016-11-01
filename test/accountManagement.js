var expect = require('expect.js');
var async = require('async');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

var accountManagement = require('../AccountManagement/accountManagement.js');

var newBlockEvents = require('../Events/newBlockEvents.js');
var events = require('../Events/eventEmitter.js');

var accounts = [];

describe('Account Management:', function() {
  this.timeout(60 * 1000);
  newBlockEvents.Start();
  it('should be able to create a public/private key pair', function(done) {
    var account = accountManagement.NewAccount();
    accounts.push(account);
    expect(account).to.not.be(null);
    expect(accountManagement.ListAccounts.length).to.be.greaterThan(0);
    done();
  });
  it('the new account should be able to receive some funds', function(done){
    web3.personal.unlockAccount(web3.eth.coinbase, '1234', function(err, res){  
      var tx = {
        from: web3.eth.coinbase, 
        to: accounts[0],
        value: 2000000
      };
      web3.eth.sendTransaction(tx, function(err, res){
        if(err){console.log('ERROR:', err);}
        events.once('100msDelayedNewBlock', function(block, intent){
          web3.eth.getBalance(accounts[0], function(err, balance){
            if(err) {console.log('ERROR:', err);}
            expect(balance.c[0]).to.be(parseInt(tx.value, 16)); 
            done();
          });
        });
      });
    });
  });
  it('the new account should be able to send some funds', function(done){
    var account = accountManagement.NewAccount();
    accounts.push(account);

    var rawTx = {
      from: accounts[0], 
      to: accounts[1], 
      gasPrice: '0x'+padToEven(Number(1).toString(16)),
      gasLimit: '0x'+padToEven(Number(25000).toString(16)),
      value: 1000
    };
    accountManagement.SignRawTransaction(rawTx, accounts[0], function(tx){
      web3.eth.sendRawTransaction(tx, function(err, hash) {
        if (err) {console.log('ERROR:', err);}
        events.once('100msDelayedNewBlock', function(block, intent){
          web3.eth.getBalance(accounts[1], function(err, balance){
            if(err) {console.log('ERROR:', err);}
            expect(balance.c[0]).to.be(rawTx.value); 
            done();
          });
        });
      });
    });
  });
});

function padToEven(n, z){
  return pad(n, n.length + n.length % 2, z);
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}
