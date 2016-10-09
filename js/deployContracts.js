#!/usr/bin/nodejs

var exec = require('child_process').exec;

var Web3 = require('web3');
var fs = require('fs');
var web3 = new Web3();
web3.setProvider(new web3.providers.HttpProvider('http://localhost:20000'));


var workingDir = __dirname + '/../Contracts/';
var contractFiles = workingDir + '*.sol';

var binCmd = 'solc --optimize --bin ' + contractFiles;
var abiCmd = 'solc --optimize --abi ' + contractFiles;

exec(binCmd, { cwd: workingDir }, function(error, stdout, stderr) {
    if (error !== null) {
        console.log('exec error: ' + error);
        console.err('stderr: ' + stderr);
        process.exit(1);
    }
    else {
      var binOutput = stdout;
      exec(abiCmd, { cwd: workingDir }, function(error, stdout, stderr) {
          if (error !== null) {
              console.log('exec error: ' + error);
              console.err('stderr: ' + stderr);
              process.exit(1);
          }
          else {
            var abiOutput = stdout;
            processCompilerOutput(binOutput, abiOutput);
          }
      });
    }
});

function processCompilerOutput(bin, abi) {
  var binLines = bin.split(/\r?\n/);
  var abiLines = abi.split(/\r?\n/);
  console.log(binLines);
  console.log(abiLines);
}
