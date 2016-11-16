import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './user';
import { UserService } from './user.service';
import { AssetService } from './asset.service';

@Component({
  moduleId: module.id,
  selector: 'assetIssuance',
  templateUrl: 'issue.component.html',
  styleUrls: [ 'issue.component.css' ]
})

export class IssueComponent implements OnInit {

  assetName: string;
  initialIssuance: number;

  constructor(
    private router: Router,
    private userService: UserService,
    private assetService: AssetService) {
  }

  ngOnInit(): void {
  }

  issue(): void {
    this.userService.getUser()
      .then(user => {
        this.assetService.createAsset(this.assetName, this.initialIssuance, user.address)
          .subscribe(
            data => {
              if(data["err"] && data["err"] != ''){
                console.log('An error occured: ', data["err"]);
              } else {
                console.log('success: ', data);
              }
            },
            err => { console.log(err.Message); }
          );
      });
  }
}

