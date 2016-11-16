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
var asset_service_1 = require('./asset.service');
var IssueComponent = (function () {
    function IssueComponent(router, userService, assetService) {
        this.router = router;
        this.userService = userService;
        this.assetService = assetService;
    }
    IssueComponent.prototype.ngOnInit = function () {
    };
    IssueComponent.prototype.issue = function () {
        var _this = this;
        this.userService.getUser()
            .then(function (user) {
            _this.assetService.createAsset(_this.assetName, _this.initialIssuance, user.address)
                .subscribe(function (data) {
                if (data["err"] && data["err"] != '') {
                    console.log('An error occured: ', data["err"]);
                }
                else {
                    console.log('success: ', data);
                }
            }, function (err) { console.log(err.Message); });
        });
    };
    IssueComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'assetIssuance',
            templateUrl: 'issue.component.html',
            styleUrls: ['issue.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, user_service_1.UserService, asset_service_1.AssetService])
    ], IssueComponent);
    return IssueComponent;
}());
exports.IssueComponent = IssueComponent;
//# sourceMappingURL=issue.component.js.map