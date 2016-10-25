var expect = require('expect.js');
var async = require('async');

var TestRPC = require("ethereumjs-testrpc");
var keythereum = require("keythereum");
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var web3 = new Web3();
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));
web3.setProvider(TestRPC.provider());

var accounts = [];
var generatedAccounts = [];

describe('Account Management:', function() {
  it('The TestRPC should generate some accounts with balances', function(done){
    web3.eth.getAccounts(function(err, accountList){
      if(err) {console.log('ERROR:', err);}
      expect(accountList.length).to.be.greaterThan(1);
      generatedAccounts = accountList;
      async.each(generatedAccounts, function(account, cb){
        web3.eth.getBalance(account, function(err, balance){
          if(err) {cb(err);}
          expect(balance.c[0]).to.be.greaterThan(0);
          cb();
        });
      }, function(err){
        if(err) {console.log('ERROR:', err);}
        done();
      });
    });
  });
  it('should be able to create a public/private key pair', function(done) {
    var account = {};
    account.privateKey = keythereum.create().privateKey.toString('hex');
    account.address = keythereum.privateKeyToAddress(account.privateKey);
    accounts.push(account);
    expect(account.privateKey).to.not.be(null);
    expect(account.privateKey).to.be(accounts[0].privateKey);
    expect(account.address).to.not.be(null);
    expect(account.address).to.be(accounts[0].address);
    done();
  });
  it('the new account should be able to receive some funds', function(done){
    var tx = {
      from: generatedAccounts[0], 
      to: accounts[0].address, 
      value: 10000
    };
    web3.eth.sendTransaction(tx, function(err, res){
      if(err){console.log('ERROR:', err);}
      web3.eth.getBalance(accounts[0].address, function(err, balance){
        if(err) {console.log('ERROR:', err);}
        // It seems like sendTransaction converts tx.value to hex, hence the parseInt
        expect(balance.c[0]).to.be(parseInt(tx.value, 16)); 
        done();
      });
    });
  });
  it('the new account should be able to send some funds', function(done){
    var account = {};
    account.privateKey = keythereum.create().privateKey.toString('hex');
    account.address = keythereum.privateKeyToAddress(account.privateKey);
    accounts.push(account);

    var rawTx = {
      from: accounts[0].address, 
      to: accounts[1].address, 
      gasPrice: '0x'+padToEven(Number(1).toString(16)),
      gasLimit: '0x'+padToEven(Number(1).toString(16)),
      value: 1000
    };

    web3.eth.getTransactionCount(accounts[0].address, function(err, nonce){
      rawTx.nonce = '0x'+nonce.toString(16);
      var tx = new Tx(rawTx);
      var privateKey = new Buffer(accounts[0].privateKey, 'hex');
      tx.sign(privateKey);
      var serializedTx = tx.serialize();
      web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
        if (err) {console.log('ERROR:', err);}
        web3.eth.getBalance(accounts[1].address, function(err, balance){
          if(err) {console.log('ERROR:', err);}
          // It seems like sendTransaction converts tx.value to hex, hence the parseInt
          expect(balance.c[0]).to.be(rawTx.value); 
          done();
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
