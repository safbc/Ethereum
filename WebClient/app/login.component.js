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
        var _this = this;
        this.userService.login(this.userName, this.password)
            .then(function (user) { _this.user = user; })
            .catch(function (err) { console.log('Something went wrong trying to log user in:', err); });
    };
    LoginComponent.prototype.register = function () {
        var _this = this;
        this.userService.register(this.userName, this.password)
            .then(function (user) {
            _this.user = user;
        });
    };
    LoginComponent.prototype.testHttp = function () {
        var _this = this;
        this.http.get('http://localhost:3002/api/randomquote.json')
            .map(function (response) { return response.json(); })
            .subscribe(function (data) {
            _this.response = data;
            console.log('response:', _this.response);
        }, function (err) { return _this.logError(err); }, function () { return console.log('Random Quote Complete', _this.response); });
    };
    LoginComponent.prototype.logError = function (err) {
        console.error('There was an error: ' + err);
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