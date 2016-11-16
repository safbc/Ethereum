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
var user_service_1 = require('./user.service');
var LoginComponent = (function () {
    function LoginComponent(router, userService) {
        this.router = router;
        this.userService = userService;
    }
    LoginComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.userService.getUser()
            .then(function (user) { return _this.user = user; });
    };
    LoginComponent.prototype.login = function () {
        var _this = this;
        this.userService.login(this.userName, this.password)
            .subscribe(function (data) {
            if (data["err"] && data["err"] != '') {
                console.log('An error occured: ', data["err"]);
                _this.errMsg = data["err"];
            }
            else {
                _this.user.name = data["name"];
                _this.user.isLoggedIn = true;
                _this.user.address = data["address"];
                _this.userService.setUser(_this.user);
            }
        }, function (err) { _this.errMsg = err.Message; });
    };
    LoginComponent.prototype.register = function () {
        var _this = this;
        this.userService.register(this.userName, this.password)
            .subscribe(function (data) {
            if (data["err"] && data["err"] != '') {
                console.log('An error occured: ', data["err"]);
                _this.errMsg = data["err"];
            }
            else {
                _this.user.name = data["name"];
                _this.user.isLoggedIn = true;
                _this.user.address = data["address"];
            }
        }, function (err) { _this.errMsg = err.Message; });
        /**this.callServer('registerNewUser');**/
    };
    LoginComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'loginPage',
            templateUrl: 'login.component.html',
            styleUrls: ['login.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService])
    ], LoginComponent);
    return LoginComponent;
}());
exports.LoginComponent = LoginComponent;
//# sourceMappingURL=login.component.js.map