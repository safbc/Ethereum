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
var user_1 = require('./user');
var core_1 = require('@angular/core');
var accountManagement = require('../AccountManagement/accountManagement');
var etherDistribution = require('../EtherDistribution/etherDistribution');
var UserService = (function () {
    function UserService() {
    }
    UserService.prototype.getUser = function () {
        if (!this.user) {
            this.user = new user_1.User();
            this.user.name = '';
            this.user.isLoggedIn = false;
        }
        return Promise.resolve(this.user);
    };
    UserService.prototype.login = function (username, password) {
        this.user.name = username;
        this.user.isLoggedIn = true;
        return Promise.resolve(this.user);
    };
    UserService.prototype.register = function (username, password) {
        var nameAndPassword = {
            name: name,
            password: password
        };
        accountManagement.HandleUserRegistration(nameAndPassword, function (newUser) {
            if (newUser) {
                this.user.name = username;
                this.user.address = newUser.address;
                this.user.isLoggedIn = true;
                etherDistribution.AddAccountToWatch(this.user.address, function (res) {
                    return Promise.resolve(this.user);
                });
            }
            else {
                throw new Error('\nUsername already taken. Please try again.\n');
            }
        });
        throw new Error('\nSomething went badly wrong in the register method - we shouldnt be here\n');
    };
    UserService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], UserService);
    return UserService;
}());
exports.UserService = UserService;
//# sourceMappingURL=user.service.js.map