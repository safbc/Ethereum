var userRegistry = require('../DataAccess/userRegistry.js');
var userBalance = require('../User/userBalances.js');
var util = require('../Util/util.js');
var async = require("async");
var config = require('../config.js');

var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider(config.rpcaddress));

var coinbasePassword = '1234';
var minBalance = 10000000000; // Wei
var noSecondsInAYear = 60*60*24*365;

function readUserPasswordFromUI(rl, cb){
  rl.question('Please enter a password: (this password is not stored securely, don\'t choose something you use elsewhere!)'+
    '\n> ', function(password){
    if(password.length > 0){
      cb(password); 
    } else {
      console.log('Password is too short!');
      readUserPasswordFromUI(rl, function(cb2){
        cb(cb2);
      });
    }
  });
}

function saveUserRegistration(userDetails, cb){
  userRegistry.AddUserToRegistry(userDetails, function(res){
    console.log('User registered:', userDetails.username, userDetails.accountAddressRepo[0].address); 
    cb(res);
  });
}

function handleUserRegistration(userDetails, cb){
  userRegistry.GetUser(userDetails.username, function(user){
    if(user==undefined){
      console.log('Creating a new user account on the blockchain...');
      web3.personal.newAccount(userDetails.password, function(err, newAccountAddress){
        console.log('newAccountAddress: ', newAccountAddress);
        if(err) {
          var errMessage = err;
          if(err.message ) {
            errMessage = err.message;
          }
          console.log('Error: ', errMessage);
          if(errMessage.indexOf('ECONNREFUSED')>-1){
            errMessage = 'Cannot connect to Ethereum network.  Please check that the ethereum network is accessible';
          }
          cb('ERROR:' + errMessage);
        } else {
          if(newAccountAddress && newAccountAddress.startsWith('0x')){
            userDetails.accountAddressRepo = [{
              address: newAccountAddress,
              description: ''
            }];
            console.log('Saving user details to Mongo...');
            saveUserRegistration(userDetails, function(){
              cb('User: ' + userDetails.username + ' succesfully registered');
            });
          } else {
            cb('ERROR:', newAccountAddress);
          }
        }
      });
    } else {
      cb('ERROR: Username ' + userDetails.username + ' already taken, please choose a different username.');
    }
  });
}

function getNewAddress(password, cb){
  web3.personal.newAccount(password, function(err, newAccountAddress){
    if (err) {console.log(err);}
    if(newAccountAddress && newAccountAddress.startsWith('0x')){
      cb(newAccountAddress); 
    } else {
      console.log('ERROR:', newAccountAddress);
      cb(null);
    }
  });
}

function handleUserRegistrationForTerminalClient(rl, cb){
  rl.question('Please enter your name or enter 0 to go back: '+
    '\n> ', function(username){
    if(username == 0){ 
      cb();  
    } else {
      console.log('Checking user registration...');  
      userRegistry.GetUser(username, function(user){
        if(user == undefined){
          readUserPasswordFromUI(rl, function(password){
            console.log('Generating new user...');
            getNewAddress(password, function(newAccountAddress){
              if(newAccountAddress){
                var obj = {
                  username: username,
                  password: password,
                  accountAddressRepo: [{
                    address: newAccountAddress,
                    description: ''
                  }]
                };
                saveUserRegistration(obj, function(){
                  cb();
                });
              } else {
                handleUserRegistrationForTerminalClient(rl, function(cb2){
                  cb(cb2);
                });
              }
            });
          });
        } else {
          console.log('Username \"'+username+'\" already taken, please choose a different username.');
          handleUserRegistrationForTerminalClient(rl, function(cb2){
            cb(cb2);
          });
        }
      });
    }
  });
}

function unlockAccountAddress(accountAddress, password, cb){
  web3.personal.unlockAccount(accountAddress, password, noSecondsInAYear, function(err, res){
    if(err) {
      if(err.message && err.message.indexOf('ECONNREFUSED')>-1 ) {
        err.message = 'Cannot connect to Ethereum network.  Please check that the ethereum network is accessible';
      }
      cb(err);
    } else {
      if(res == true){
        cb(null);
      } else {
        cb(new Error('Could not unlock user account'));
      }
    }
  });
}

function handleUserLogin(loginDetails, cb){
  var response = {user: null, msg: null, err: null};
  userRegistry.GetUserAndPassword(loginDetails.username, loginDetails.password, function(user){
    if(user != undefined){
      fundAllAccountsFromCoinbase(user.accountAddressRepo, function(res0){
        unlockAllAccountAddresses(user.accountAddressRepo, loginDetails.password, function(unlockAddressesResult){
          if(response.err) {
            response.msg = response.err.message;
          } else {
            response.user = user;
            response.msg = user.username + ' is logged in and the account is unlocked';
            console.log('All accounts are unlocked');
          }
          cb(response);
        });
      });
    } else {
      response.err = new Error('Password and username do not match.');
      response.msg = 'ERROR';
      cb(response);
    }
  });
}

function handleUserLoginForTerminalClient (rl, cb){
  rl.question('Please enter your name or enter 0 to go back: '+
    '\n> ', function(username){
    if(username == 0){ 
      cb(null);  
    } else {
      rl.question('Password: ', function(password){
        console.log('Authenticating user and unlocking account...');
        userRegistry.GetUserAndPassword(username, password, function(user){
          if(user != undefined){
            fundAllAccountsFromCoinbase(user.accountAddressRepo, function(res0){
              web3.personal.unlockAccount(user.accountAddressRepo[0].address
                , password, noSecondsInAYear, function(err, res){
                if (err) {console.log('ERROR:', err);}
                if(res == true){
                  console.log(user.username, 'is logged in and the account is unlocked');
                  cb({user: user});
                } else {
                  console.log('ERROR: Could not unlock account');
                  cb(null);
                }
              });
            });
          } else {
            console.log('Password and username', username, 'does not match.');
            handleUserLogin(rl, function(cb2){
              cb(cb2);
            });
          }
        });
      });
    }
  });
}

function addNewAddressWithDescriptionToUser(username, addressDescription, cb){
  userRegistry.GetUser(username, function(user){
    getNewAddress(user.password, function(newAccountAddress){
      var obj = {
        address: newAccountAddress,
        description: addressDescription
      };
      user.accountAddressRepo.push(obj);
      userRegistry.UpdateUser(user, function(res){
        cb(obj); 
      });
    });
  });
}

exports.HandleUserRegistrationForTerminalClient = handleUserRegistrationForTerminalClient;
exports.HandleUserRegistration = handleUserRegistration;
exports.HandleUserLoginForTerminalClient = handleUserLoginForTerminalClient;
exports.HandleUserLogin = handleUserLogin;
exports.AddNewAddressWithDescriptionToUser = addNewAddressWithDescriptionToUser;
