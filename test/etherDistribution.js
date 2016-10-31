var expect = require('expect.js');
var async = require('async');

var accountManagement = require('../AccountManagement/accountManagement.js');
var etherDistribution = require('../EtherDistribution/etherDistribution.js');
var newBlockEvents = require('../Events/newBlockEvents.js');
var events = require('../Events/eventEmitter.js');

var accounts = [];

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

describe('Ether distribution:', function() {
  this.timeout(60 * 1000);
  etherDistribution.StartEtherDistribution();
  it('Should allow adding another account and that account should then be funded', function(done){
    var account = accountManagement.NewAccount();
    accounts.push(account);
    etherDistribution.AddAccountToWatch(account, function(res){
      events.once('100msDelayedNewBlock', function(block, intent){
        web3.eth.getBalance(account, function(err, balance){ 
          expect(balance.c[0]).to.be(etherDistribution.DefaultBalance);
          done();
        });
      });
    });
  });
  it('Should top up account if account sends funds', function(done){
    var account = accountManagement.NewAccount();
    accounts.push(account);
    var rawTx = {
      from: accounts[0], 
      to: accounts[1], 
      value: etherDistribution.MinimumBalance+500
    };
    var gasCost = web3.eth.estimateGas(rawTx);
    rawTx.gasPrice = '0x'+padToEven(Number(1).toString(16));
    rawTx.gasLimit = '0x'+padToEven(Number(gasCost).toString(16));
    accountManagement.SignRawTransaction(rawTx, accounts[0], function(tx){
      web3.eth.sendRawTransaction(tx, function(err, hash) {
        if (err) {console.log('ERROR:', err);}
        events.once('100msDelayedNewBlock', function(block, intent){
          web3.eth.getBalance(accounts[1], function(err, balance){
            if(err) {console.log('ERROR:', err);}
            expect(balance.c[0]).to.be(parseInt(rawTx.value, 16)); 
            events.once('100msDelayedNewBlock', function(block, intent){
              web3.eth.getBalance(accounts[0], function(err, balance){
                if(err) {console.log('ERROR:', err);}
                expect(balance.c[0]).to.be.greaterThan(etherDistribution.MinimumBalance); 
                done();
              });
            });
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
