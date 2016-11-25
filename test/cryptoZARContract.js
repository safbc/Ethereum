var expect = require('expect.js');
var cryptoZARIssuance = require('../Issuance/cryptoZARIssuance.js');
var balanceIssuance = require('../Issuance/balanceContract.js');
var util = require('../Util/util.js');
var newBlockEvents = require('../Events/newBlockEvents.js');
var events = require('../Events/eventEmitter.js');

var contractRawTx = require('ethereum-transaction-creator');
var keythereum = require("keythereum");
var Tx = require('ethereumjs-tx');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

var amountOfXZAToIssue = 1000;
var ownerAddress = null;
var account2 = null;
var account3 = {
  address: null,
  privateKey: null
};
var balanceContract = {
  address: null,
  abi: null
};
var xzaContract = {
  address: null,
  abi: null
};

describe('CryptoZARContract', function() {
  this.timeout(60 * 1000);
  newBlockEvents.Start(); 
  it('should be able to deploy the cryptoZAR contract', function(done) {
    setup(function(res){
      expect(ownerAddress).to.not.be(null);

      balanceIssuance.SubmitContract(ownerAddress, amountOfXZAToIssue, function(res){
        expect(res.contractAddress).to.not.be(null);
        expect(res.contractSource).to.not.be(null);
        expect(res.contractABI).to.not.be(null);
        balanceContract.address = res.contractAddress;
        balanceContract.abi = res.contractABI;

        web3.eth.defaultAccount = ownerAddress;
        cryptoZARIssuance.SubmitCryptoZARContract(balanceContract.address, function(res){
          expect(res.contractAddress).to.not.be(null);
          expect(res.contractABI).to.not.be(null);
          xzaContract.address = res.contractAddress;
          xzaContract.abi = res.contractABI;
          var xza = util.GetInstanceFromABI(xzaContract.abi, xzaContract.address);
          expect(xza.balanceContractAddress()).to.be(balanceContract.address);
          // Change the owner of tha balance contract to the xzaContract.address
          var balanceContractInstance = util.GetInstanceFromABI(balanceContract.abi
            , balanceContract.address);
          balanceContractInstance.transferOwnership(xzaContract.address, {gas: 100000, gasPrice:1});
          var transferEvent = balanceContractInstance.TransferOwnership({}, function(err, res){
            if(err){console.log('ERROR:', err);}
            transferEvent.stopWatching();
            expect(balanceContractInstance.owner()).to.be(xzaContract.address);
            done();
          });
        });
      });
    });
  });
  it('should be able to get a balance', function(done) {
    var xza = util.GetInstanceFromABI(xzaContract.abi, xzaContract.address);
    var xzaBalance = util.GetInstanceFromABI(balanceContract.abi, xza.balanceContractAddress());
    var balanceObj = xzaBalance.balanceOf(ownerAddress);
    expect(balanceObj).to.not.be(null);
    expect(balanceObj.c[0]).to.be(amountOfXZAToIssue);
    done();
  });
  it('should be able to issue additional XZA', function(done) {
    var xza = util.GetInstanceFromABI(xzaContract.abi, xzaContract.address);
    var xzaBalance = util.GetInstanceFromABI(balanceContract.abi, xza.balanceContractAddress());
    xza.adjustOwnerBalance(10, {gas: 100000, gasPrice:1});
    var addToBalanceEvent = xzaBalance.AddToBalanceOf({}, function(err, res){ 
      addToBalanceEvent.stopWatching();
      if(err){console.log('ERROR:', err);}
      var balanceObj = xzaBalance.balanceOf(ownerAddress);
      expect(balanceObj.c[0]).to.be(amountOfXZAToIssue + 10);
      done();
    });
  });
  it('should be able to decrease XZA of the owner', function(done) {
    var xza = util.GetInstanceFromABI(xzaContract.abi, xzaContract.address);
    var xzaBalance = util.GetInstanceFromABI(balanceContract.abi, xza.balanceContractAddress());
    xza.adjustOwnerBalance(-10, {gas:100000, gasPrice:1}); 
    var subtractFromBalanceEvent = xzaBalance.SubtractFromBalanceOf({}, function(err, res){ 
      subtractFromBalanceEvent.stopWatching();
      if(err){console.log('ERROR:', err);}
      var balanceObj = xzaBalance.balanceOf(ownerAddress);
      expect(balanceObj.c[0]).to.be(amountOfXZAToIssue);
      done();
    });
  });
  it('should be able to transfer XZA', function(done) {
    var xza = util.GetInstanceFromABI(xzaContract.abi, xzaContract.address);
    var xzaBalance = util.GetInstanceFromABI(balanceContract.abi, xza.balanceContractAddress());
    xza.transfer(account3.address, 10, {gas:100000, gasPrice:1});

    var transferEvent = xza.Transfer({}, function(err, res){ 
      transferEvent.stopWatching();
      if(err){console.log('ERROR:', err);}
      var balanceObj = xzaBalance.balanceOf(ownerAddress);
      expect(balanceObj.c[0]).to.be(amountOfXZAToIssue-10);
      balanceObj = xzaBalance.balanceOf(account3.address);
      expect(balanceObj.c[0]).to.be(10);
      done();
    });
  });
  it('should be able to transfer XZA by creating a rawTransaction', function(done) {
    contractRawTx.GetContractInstance(xzaContract.abi, xzaContract.address, function(xza){
      var xzaBalance = util.GetInstanceFromABI(balanceContract.abi, balanceContract.address);
      xza.transfer(account2, 10, function(rawTx){
        var nonce = web3.eth.getTransactionCount(account3.address);
        rawTx.nonce = '0x'+nonce.toString(16);
        var tx = new Tx(rawTx);

        var privateKey = new Buffer(account3.privateKey, 'hex');
        tx.sign(privateKey);

        var serializedTx = tx.serialize();
        web3.eth.sendRawTransaction(serializedTx.toString('hex'), function(err, hash) {
          if (err) {console.log('ERROR:', err);}
          var transferEvent = xzaBalance
              .BalanceTransfer({'fromAddress': account3.address}, function(err, res){ 
            transferEvent.stopWatching();
            if(err){console.log('ERROR:', err);}
            var balanceObj = xzaBalance.balanceOf(account2);
            expect(balanceObj.c[0]).to.be(10);
            balanceObj = xzaBalance.balanceOf(account3.address);
            expect(balanceObj.c[0]).to.be(0);
            done();
          });
        });        
      });
    }); 
  });
});

function setup(cb){
  util.UnlockAccount(web3.eth.coinbase, '1234', function(res){
    web3.personal.newAccount('1', function(err, ownerAddress_){
    web3.personal.newAccount('1', function(err, account2_){
      ownerAddress = ownerAddress_;
      account2 = account2_;

      account3.privateKey = keythereum.create().privateKey.toString('hex');
      account3.address = keythereum.privateKeyToAddress(account3.privateKey); 

      util.PrefundAndUnlockAccount(ownerAddress, '1', function(res){
      util.PrefundAndUnlockAccount(account2, '1', function(res){
      web3.eth.sendTransaction({from:web3.eth.coinbase, to:account3.address, value:200000000}
        , function(err, res){
          if(err){console.log('ERROR:', err);}
          events.once('newBlock', function(block, intent){
            cb();
          });
      });
      });
      });
    });
    });
  });
}
