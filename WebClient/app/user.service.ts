import { Injectable } from '@angular/core';
import { User } from './user';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import {Observable} from 'rxjs/Rx';
import 'rxjs/add/operator/map';

@Injectable()
export class UserService {

  constructor(
    private http: Http) {
  }

  getUser(): Promise<User> {
    let user=new User();
    user.isLoggedIn=false;

    return Promise.resolve(user);
  }

  login(username:string , password:string): Observable<Response> {
    return this.callServer('login', username, password);
  }

  register(username:string , password:string): Observable<Response> {
    return this.callServer('registerNewUser', username, password);
  }

  callServer(functionCall:string, username: string, password: string): Observable<Response> {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({'userName' : username, 'password' : password});
    let user = new User();
    return this.http.post('http://localhost:3032/' + functionCall, body , options)
      .map(response => response.json());
  }
}
