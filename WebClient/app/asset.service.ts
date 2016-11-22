import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class AssetService {
  
  constructor(
    private http: Http) {
  }

  createAsset(assetName:string , initialIssuance:number, userAddress:string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({
      'assetName' : assetName, 
      'initialIssuance' : initialIssuance, 
      'userAddress': userAddress
    });
    return this.http.post('http://localhost:3032/createAsset', body , options)
      .map(response => response.json());
  }

  getListOfAssets(): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    return this.http.get('http://localhost:3032/getListOfContracts', options)
      .map(response => response.json());
  }

  getAssetBalance(assetName: string, userAddress: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({
      'assetName' : assetName,
      'userAddress': userAddress
    });
    return this.http.post('http://localhost:3032/getAssetBalance', body, options)
      .map(response => response.json());
  }

}
