var accountManagement = require('../AccountManagement/accountManagement.js');
var etherDistribution = require('../EtherDistribution/etherDistribution.js');

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
        return;
      } else if (answer == 1){ // Register new user
        getNameAndPassword(function(nameAndPassword){
          handleUserRegistration(nameAndPassword, function(newUser){
            loggedInUser = newUser;
            run();
          });      
        });
      } else if (answer == 2){ // Login         
        
      } else {
        run();
      }
    });
  } else {

  }
}

run();
