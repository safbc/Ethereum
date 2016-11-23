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
var user_1 = require('./user');
var http_1 = require("@angular/http");
require('rxjs/add/operator/map');
var UserService = (function () {
    function UserService(http) {
        this.http = http;
    }
    UserService.prototype.getUser = function () {
        if (!this.user) {
            this.user = new user_1.User();
            this.user.isLoggedIn = false;
        }
        return Promise.resolve(this.user);
    };
    UserService.prototype.setUser = function (user) {
        this.user = user;
    };
    UserService.prototype.login = function (username, password) {
        return this.postToServer('login', username, password);
    };
    UserService.prototype.register = function (username, password) {
        return this.postToServer('registerNewUser', username, password);
    };
    UserService.prototype.getListOfUsers = function () {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this.http.get('http://localhost:3032/getListOfUsers', options)
            .map(function (response) { return response.json(); });
    };
    UserService.prototype.postToServer = function (functionCall, username, password) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var body = JSON.stringify({ 'userName': username, 'password': password });
        return this.http.post('http://localhost:3032/' + functionCall, body, options)
            .map(function (response) { return response.json(); });
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map