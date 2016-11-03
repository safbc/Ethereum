var expect = require('expect.js');
var issuance = require('../Issuance/balanceContract.js');
var util = require('../Util/util.js');
var newBlockEvents = require('../Events/newBlockEvents.js');
var events = require('../Events/eventEmitter.js');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

var initialSupply = 10;
var ownerAddress = null;
var account2 = null;
var balanceContract = {
  address: null,
  abi: null
};

describe('Balance contract', function() {
  this.timeout(60 * 1000);
  newBlockEvents.Start(); 
  it('should be able to deploy the balance contract', function(done) {
    setup(function(res){
      expect(ownerAddress).to.not.be(null);
      expect(account2).to.not.be(null);
      issuance.SubmitContract(ownerAddress, initialSupply, function(res){
        expect(res.contractAddress).to.not.be(null);
        expect(res.contractSource).to.not.be(null);
        expect(res.contractABI).to.not.be(null);
        balanceContract.address = res.contractAddress;
        balanceContract.abi = res.contractABI;
        done();
      });
    });
  });
  it('Can get the balance of an address', function(done) {
    var instance = util.GetInstanceFromABI(balanceContract.abi, balanceContract.address);
    web3.eth.defaultAccount = ownerAddress;
    var ownerBalance = instance.balanceOf(ownerAddress);
    expect(ownerBalance.c[0]).to.be(initialSupply);
    done();
  });
  it('Can set the balance of an address', function(done) {
    var newBalance = 20;
    var instance = util.GetInstanceFromABI(balanceContract.abi, balanceContract.address);
    web3.eth.defaultAccount = ownerAddress;
    instance.setBalanceOf(ownerAddress, newBalance, {gas: 100000, gasPrice: 1});
    var setBalanceOfEvent = instance.SetBalanceOf({}, function(err, res){
      if(err){console.log('ERROR:', err);}
      setBalanceOfEvent.stopWatching();
      var ownerBalance = instance.balanceOf(ownerAddress);
      expect(ownerBalance.c[0]).to.be(newBalance);
      done();
    });
  });
  it('Can transfer the balance of an address', function(done) {
    var transferBalance = 10;
    var instance = util.GetInstanceFromABI(balanceContract.abi, balanceContract.address);
    var oldOwnerBalance = instance.balanceOf(ownerAddress);
    web3.eth.defaultAccount = ownerAddress;
    instance.transfer(ownerAddress, account2, transferBalance, {gas: 100000, gasPrice: 1});
    var transferEvent = instance.BalanceTransfer({}, function(err, res){
      if(err){console.log('ERROR:', err);}
      transferEvent.stopWatching();
      var ownerBalance = instance.balanceOf(ownerAddress);
      var account2Balance = instance.balanceOf(account2);
      expect(ownerBalance.c[0]).to.be(oldOwnerBalance.c[0] - transferBalance);
      expect(account2Balance.c[0]).to.be(transferBalance);
      done();
    });
  });
  it('Can\'t set the balance of an address if not owner', function(done) {
    var newBalance = 100;
    var instance = util.GetInstanceFromABI(balanceContract.abi, balanceContract.address);
    var oldAccount2Balance = instance.balanceOf(account2);
    web3.eth.defaultAccount = account2;
    instance.setBalanceOf(account2, newBalance, {gas: 100000, gasPrice: 1});
    events.once('newBlock', function(block, intent){
      var account2Balance = instance.balanceOf(account2);
      expect(account2Balance.c[0]).to.be(oldAccount2Balance.c[0]); 
      done();
    });
  });
  it('Can\'t transfer the balance of an address if not the owner', function(done) {
    var transferBalance = 10;
    var instance = util.GetInstanceFromABI(balanceContract.abi, balanceContract.address);
    var oldOwnerBalance = instance.balanceOf(ownerAddress);
    var oldAccount2Balance = instance.balanceOf(account2);
    web3.eth.defaultAccount = account2;
    instance.transfer(ownerAddress, account2, transferBalance, {gas: 100000, gasPrice: 1});
    events.once('newBlock', function(block, intent){
      var ownerBalance = instance.balanceOf(ownerAddress);
      var account2Balance = instance.balanceOf(account2);
      expect(ownerBalance.c[0]).to.be(oldOwnerBalance.c[0]);
      expect(account2Balance.c[0]).to.be(oldAccount2Balance.c[0]);
      done();
    });
  });
});

function setup(cb){
  util.UnlockAccount(web3.eth.coinbase, '1234', function(res){
    web3.personal.newAccount('1', function(err, ownerAddress_){
    web3.personal.newAccount('1', function(err, account2_){
      ownerAddress = ownerAddress_;
      account2 = account2_;
      util.PrefundAndUnlockAccount(ownerAddress, '1', function(res){
      util.PrefundAndUnlockAccount(account2, '1', function(res){
        events.once('newBlock', function(block, intent){
          cb();
        });
      });
      });
    });
    });
  });
}
