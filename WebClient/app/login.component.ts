import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { User } from './user';
import { UserService } from './user.service';

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

  constructor(
    private router: Router,
    private userService: UserService) {
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
}

