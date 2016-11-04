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

  constructor(
    private router: Router,
    private userService: UserService) {
  }

  ngOnInit(): void {
    /** Check to see if the user is logged in **/

    this.userService.getUser()
      .then(user => this.user = user);
  }
}

