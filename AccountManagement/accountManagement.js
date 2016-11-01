/*
The idea behind this script is that the private key never leaves this file, other than going to the
DB.

The private key and password will more to a different type of storage (HSMs?) in the near future.
*/

var userRegistry = require('../DataAccess/userRegistry.js');

var keythereum = require("keythereum");
var Tx = require('ethereumjs-tx');
var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

var accounts = {}

function newAccount(password, cb){
  var privateKey = keythereum.create().privateKey.toString('hex');
  var address = keythereum.privateKeyToAddress(privateKey);
  accounts[address] = {
    privateKey: new Buffer(privateKey, 'hex'), 
    password: password
  };
  if(cb){
    cb(address);
  } else {
    return address;
  }
}

function handleUserRegistration(nameAndPassword, cb){
  userRegistry.GetUser(nameAndPassword.name, function(user){
    if(user == null){
      user = {};
      user.address = newAccount(nameAndPassword.password);
      user.name = nameAndPassword.name;      
      user.password = nameAndPassword.password;
      user.privateKey = accounts[user.address].privateKey;
      userRegistry.AddUserToRegistry(user, function(res){
        var obj = {
          name: user.name,
          address: user.address,
          password: user.password
        }
        cb(obj);
      });
    } else {
      var obj = {
        name: user.name,
        address: user.address,
        password: user.password
      }
      cb(null);
    }
  });   
}

function userLogin(name, password, cb){
  userRegistry.GetUserAndPassword(name, password, function(user){
    accounts[user.address] = {
      privateKey: user.privateKey, 
      password: password
    };
    var obj = {
      name: user.name,
      address: user.address,
      password: password
    }
    cb(obj);   
  });
}

// Can't get the private key without the password, this function is to remain private!
function getPrivateKey(address, password, cb){
  if(accounts[address] != null && accounts[address].password == password){
    var privateKey = accounts[senderAddress].privateKey;
    cb(privateKey);
  } else { // Load into cache
    userRegistry.GetAddressAndPassword(senderAddress, password, function(user){
      accounts[address] = {
        privateKey: user.privateKey, 
        password: password
      };
      getPrivateKey(address, password, function(res){
        cb(res);   
      });
    });
  }
}

function signRawTransaction(rawTx, senderAddress, password, cb){
  getPrivateKey(senderAddress, password, function(privateKey){
    web3.eth.getTransactionCount(senderAddress, function(err, nonce){
      rawTx.nonce = '0x'+nonce.toString(16);
      var tx = new Tx(rawTx);
      tx.sign(privateKey);
      var serializedTx = tx.serialize();
      cb(serializedTx.toString('hex'));
    });
  });
}

exports.NewAccount = newAccount;
exports.SignRawTransaction = signRawTransaction;
exports.HandleUserRegistration = handleUserRegistration;
exports.Login = userLogin;
