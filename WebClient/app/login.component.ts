import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {Http} from "@angular/http";

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
    this.http.get('http://localhost:3002/api/randomquote.json')
			.map(res => res.text())
			.subscribe(
				data => this.randomQuote = data,
				err => this.logError(err),
				() => console.log('Random Quote Complete', this.randomQuote)
			);
  }

	logError(err:any) {
		console.error('There was an error: ' + err);
	}
}

