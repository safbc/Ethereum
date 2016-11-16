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
var http_1 = require("@angular/http");
require('rxjs/add/operator/map');
var AssetService = (function () {
    function AssetService(http) {
        this.http = http;
    }
    AssetService.prototype.createAsset = function (assetName, initialIssuance, userAddress) {
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        var body = JSON.stringify({
            'assetName': assetName,
            'initialIssuance': initialIssuance,
            'userAddress': userAddress
        });
        return this.http.post('http://localhost:3032/createAsset', body, options)
            .map(function (response) { return response.json(); });
    };
    AssetService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], AssetService);
    return AssetService;
}());
exports.AssetService = AssetService;
//# sourceMappingURL=asset.service.js.map