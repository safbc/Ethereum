var Web3 = require('web3');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));

var eventEmitter = require('./eventEmitter.js');

function start(){
  var latest = web3.eth.filter('latest');
  latest.watch(function(err, block){
    if(err) {console.log('ERROR:', err);}
    eventEmitter.emit('newBlock', block, 'latest');
  });
}

exports.Start = start;
