var express = require('express')
var bodyParser = require('body-parser')
var app = express()
var accountManagement = require('../AccountManagement/accountManagement.js');
var etherDistribution = require('../EtherDistribution/etherDistribution.js');

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(bodyParser.json());

app.post('/login', function (req, res) {
  var userName = req.body.userName;
  var password = req.body.password;
  accountManagement.Login(userName, password, function(user){
    if(user){
      loggedInUser = user; 
        etherDistribution.AddAccountToWatch(loggedInUser.address, function(err){
					if(err){
						res.json({'err': 'There was an error accessing this account - please check that the blockchain node is running'});
					} else {
						res.json(user);
					}
        });
    } else {
      res.json({'err': 'invalid username or password'});
    }
  }); 
})

app.post('/registerNewUser', function(req, res){
  if(req.body){
		console.log('userName', req.body.userName);
		console.log('password', req.body.password);
		var userNameAndPassword = {
			name: req.body.userName,
			password: req.body.password
		};
		accountManagement.HandleUserRegistration(userNameAndPassword, function(user){
			if(user){
				res.json(user);
			} else {
				res.json({'err': 'That username is already registered on the system'});
			}
		});   
	} else {
		res.json({'err': 'There was nothing in the body'});
  }
});

app.listen(3032, function () {
    console.log('Springblock API running on port 3032')
})
