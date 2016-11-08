var mongojs = require('mongojs')

var config = require('../config.js');
var db;

function logError(err){
  if(err){
    if(err.message == 'ns not found'){
      return;
    } else {
      console.log(err);
    }
  }
}

function connectToDB(cb){
  var dbConnection = mongojs(config.dbConnectionString, config.dbCollections);
  db = dbConnection;
  cb();
}

function getContract(contractName, contractVersion, cb){
  if(!db){
    connectToDB(function(){
      getContract(contractName, contractVersion, function(res){
        cb(res);
      });
    });
  } else {
    db.contractRegistry.findOne({name: contractName, version: contractVersion}, function(err, doc){
      logError(err);
      cb(doc);
    });
  }
}

function addContract(entry, cb){
  if(!db){
    connectToDB(function(){
      addContract(entry, function(res){
        cb(res);
      });
    });
  } else {
    db.contractRegistry.insert(entry, function(err, doc){
      logError(err);
      cb(doc);
    });
  }
}

/*function updateCryptoZAR(entry, cb){
  if(!db){
    connectToDB(function(){
      updateCryptoZAR(entry, function(res){
        cb(res);
      });
    });
  } else {
    db.cryptoZARRegistry.save(entry, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}*/

function closeDB(){
  if(db != null || db != undefined){
    db.close();
  }
}

exports.GetContract = getContract;
exports.AddContract =  addContract;
//exports.UpdateCryptoZAR =  updateCryptoZAR;
exports.CloseDB = closeDB;
