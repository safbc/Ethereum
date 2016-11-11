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
    this.userService.login(this.userName, this.password)
      .then(user => { this.user = user; })
      .catch(err => { console.log('Something went wrong trying to log user in:', err); });
  }

  register(): void {
    this.userService.register(this.userName, this.password)
      .then(user => {
        this.user = user;
      });
  }

  testHttp(): void {
    let headers = new Headers({ 'Content-Type': 'application/json' });
    let options = new RequestOptions({ headers: headers });
    let body = JSON.stringify({'userName' : 'RMB', 'password' : '12345'});
    console.log(body);
    this.http.post('http://localhost:3032/registerNewUser', body , options)
      .map(response => response.json())
			.subscribe(
				data => {
            this.response = data;
            console.log('response:', this.response);
            },
				err => this.logError(err),
				() => console.log('Random Quote Complete', this.response)
			);
  }

	logError(err:any) {
		console.error('There was an error: ' + err);
	}
}

