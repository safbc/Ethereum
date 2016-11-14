"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var http_1 = require("@angular/http");
var user_service_1 = require('./user.service');
require('rxjs/add/operator/map');
var LoginComponent = (function () {
    function LoginComponent(router, userService, http) {
        this.router = router;
        this.userService = userService;
        this.http = http;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getUser()
            .then(function (user) { return _this.user = user; });
    };
    LoginComponent.prototype.login = function () {
        this.callServer('login');
    };
    LoginComponent.prototype.register = function () {
        this.callServer('registerNewUser');
    };
    LoginComponent.prototype.logError = function (err) {
        console.error('There was an error: ' + err);
    };
    LoginComponent.prototype.callServer = function (functionCall) {
        var _this = this;
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var body = JSON.stringify({ 'userName': this.userName, 'password': this.password });
        this.http.post('http://localhost:3032/' + functionCall, body, options)
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            _this.response = data;
            console.log('response:', _this.response);
            if (data["err"] && data["err"] != '') {
                console.log('An error occured: ', data["err"]);
            }
            else {
                _this.user.name = data["name"];
                _this.user.isLoggedIn = true;
                _this.user.address = data["address"];
                console.log('user:', _this.user);
            }
        }, function (err) { return _this.logError(err); }, function () { return console.log('User (Raw)', _this.response); });
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'loginPage',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService, http_1.Http])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map