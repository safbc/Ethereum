var expect = require('expect.js');
var TestRPC = require("ethereumjs-testrpc");

var Web3 = require('web3');
var web3 = new Web3();
//web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));
web3.setProvider(TestRPC.provider());

describe('Test token contract:', function() {
  it('should be able to deploy the test token contract', function(done) {
    done();
  });
});
