var accountManagement = require('../AccountManagement/accountManagement.js');
var etherDistribution = require('../EtherDistribution/etherDistribution.js');
var userRegistry = require('../DataAccess/userRegistry.js');

var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

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

var loggedInUser = null;

function run(){
  etherDistribution.StartEtherDistribution();
  if(loggedInUser == null){
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
            loggedInUser = nameAndPassword;
            loggedInUser.address = newUser.address;
            run();
          });      
        });
      } else if (answer == 2){ // Login         
        getNameAndPassword(function(nameAndPassword){
          accountManagement.Login(nameAndPassword.name, nameAndPassword.password, function(user){
            loggedInUser = user; 
            run();
          }); 
        });        
      } else {
        run();
      }
    });
  } else {
    var displayUser = {
      name: loggedInUser.name,
      address: loggedInUser.address
    };
    console.log('User:', displayUser.name);
    console.log('Address:', displayUser.address);
    rl.question('What would you like to do: '+
      '\n1) Send funds'+
      '\n0) Quit'+
      '\n> ', function(answer){
      if(answer == 0){
        console.log('Quiting');
        rl.close();
        userRegistry.CloseDB();
        return;
      } else if (answer == 1){ // Register new user
      } else if (answer == 2){ // Login         
      } else {
        run();
      }
    });
  }
}

run();
