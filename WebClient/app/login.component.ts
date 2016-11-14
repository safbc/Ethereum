import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Http, Response, Headers, RequestOptions } from "@angular/http";
import { User } from './user';
import { UserService } from './user.service';
import 'rxjs/add/operator/map';

@Component({
  moduleId: module.id,
  selector: 'loginPage',
  templateUrl: 'login.component.html',
  styleUrls: [ 'login.component.css' ]
})

export class LoginComponent implements OnInit {

  user: User;
  userName: string;
  password: string;
  errMsg: string;
  randomQuote: string;
  response: Response;

  constructor(
    private router: Router,
    private userService: UserService, 
    private http: Http) {
  }

  ngOnInit(): void {
    this.userService.getUser()
      .then(user => this.user = user);
  }

  login(): void {
    this.callServer('login');
  }

  register(): void {
    this.callServer('registerNewUser');
  }

	logError(err:any) {
		console.error('There was an error: ' + err);
	}

  callServer(functionCall:string) {
    this.errMsg = "";
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({'userName' : this.userName, 'password' : this.password});
    this.http.post('http://localhost:3032/' + functionCall, body , options)
      .map(response => response.json())
			.subscribe(
				data => {
            this.response = data;
            console.log('response:', this.response);
            if(data["err"] && data["err"] != ''){
              console.log('An error occured: ', data["err"]);
              this.errMsg = data["err"];
            } else {
              this.user.name = data["name"];
              this.user.isLoggedIn = true;
              this.user.address = data["address"];
              console.log('user:', this.user);
            }
            },
				err => this.logError(err),
				() => console.log('User (Raw)', this.response)
			);
  }
}

