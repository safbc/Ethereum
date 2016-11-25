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

function getListOfUsers(cb){
  if(!db){
    connectToDB(function(){
      getListOfUsers(function(res){
        cb(res);
      });
    });
  } else {
    db.userRegistry.find(function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}

function getUser(name, cb){
  if(!db){
    connectToDB(function(){
      getUser(name, function(res){
        cb(res);
      });
    });
  } else {
    db.userRegistry.findOne({name: {$regex: new RegExp('^'+name+'$', 'i')}}, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}

function getUserAndPassword(name, password, cb){
  if(!db){
    connectToDB(function(){
      getUserAndPassword(name, password, function(res){
        cb(res);
      });
    });
  } else {
    db.userRegistry.findOne({name: {$regex: new RegExp('^'+name+'$', 'i')}, password: password}, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}

function getAddressAndPassword(address, password, cb){
  if(!db){
    connectToDB(function(){
      getAddressAndPassword(address, password, function(res){
        cb(res);
      });
    });
  } else {
    db.userRegistry.findOne({address: address, password: password}, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}

function getUserRegistry(cb){
  if(!db){
    connectToDB(function(){
      getUserRegistry(function(res){
        cb(res);
      });
    });
  } else {
    db.userRegistry.find({}, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}

function findUserFromAddress(address, cb){
  if(!db){
    connectToDB(function(){
      findUserFromAddress(address, function(res){
        cb(res);
      });
    });
  } else {
    db.userRegistry.findOne({'accountAddressRepo.address': address}, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}

function addUserToRegistry(entry, cb){
  if(!db){
    connectToDB(function(){
      addUserToRegistry(entry, function(res){
        cb(res);
      });
    });
  } else {
    db.userRegistry.insert(entry, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}

function updateUser(entry, cb){
  if(!db){
    connectToDB(function(){
      updateUser(entry, function(res){
        cb(res);
      });
    });
  } else {
    db.userRegistry.save(entry, function(err, docs){
      logError(err);
      cb(docs);
    });
  }
}

function closeDB(){
  if(db != null || db != undefined){
    db.close();
  }
}

exports.GetUser = getUser;
exports.GetListOfUsers = getListOfUsers;
exports.GetUserRegistry = getUserRegistry;
exports.AddUserToRegistry = addUserToRegistry;
exports.CloseDB = closeDB;
exports.GetUserAndPassword = getUserAndPassword;
exports.GetAddressAndPassword = getAddressAndPassword;
exports.UpdateUser = updateUser;
exports.FindUserFromAddress = findUserFromAddress;
