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
var transaction_service_1 = require('./transaction.service');
var TransferComponent = (function () {
    function TransferComponent(router, transactionService) {
        this.router = router;
        this.transactionService = transactionService;
        this.transactions = [];
    }
    TransferComponent.prototype.ngOnInit = function () {
        var _this = this;
        this.contractService.getListOfContracts()
            .then(function (transactions) { return _this.transactions = transactions.slice(1, 5); });
    };
    TransferComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            selector: 'my-dashboard',
            templateUrl: 'transfer.component.html',
            styleUrls: ['transfer.component.css']
        }), 
        __metadata('design:paramtypes', [router_1.Router, transaction_service_1.TransactionService])
    ], TransferComponent);
    return TransferComponent;
}());
exports.TransferComponent = TransferComponent;
//# sourceMappingURL=transfer.component.js.map