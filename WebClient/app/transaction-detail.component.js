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
var common_1 = require('@angular/common');
var transaction_service_1 = require('./transaction.service');
var TransactionDetailComponent = (function () {
    function TransactionDetailComponent(transactionService, route, location) {
        this.transactionService = transactionService;
        this.route = route;
        this.location = location;
    }
    TransactionDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.route.params.forEach(function (params) {
            var id = +params['id'];
            _this.transactionService.getTransaction(id)
                .then(function (transaction) { return _this.transaction = transaction; });
        });
    };
    TransactionDetailComponent.prototype.goBack = function () {
        this.location.back();
    };
    TransactionDetailComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-transaction-detail',
            templateUrl: 'transaction-detail.component.html',
            styleUrls: ['transaction-detail.component.css']
        }), 
        __metadata('design:paramtypes', [transaction_service_1.TransactionService, router_1.ActivatedRoute, common_1.Location])
    ], TransactionDetailComponent);
    return TransactionDetailComponent;
}());
exports.TransactionDetailComponent = TransactionDetailComponent;
//# sourceMappingURL=transaction-detail.component.js.map