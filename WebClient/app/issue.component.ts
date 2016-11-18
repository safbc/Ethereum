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
  msg: string;
  errMsg: string;
  isProcessing: boolean = false;

  constructor(
    private router: Router,
    private userService: UserService,
    private assetService: AssetService) {
  }

  ngOnInit(): void {
  }

  issue(): void {
    this.errMsg = "";
    this.msg = this.assetName + " is being issued onto the Springblock blockchain.....";
    this.isProcessing = true;
    this.userService.getUser()
      .then(user => {
        this.assetService.createAsset(this.assetName, this.initialIssuance, user.address)
          .subscribe(
            data => {
              if(data["err"] && data["err"] != ''){
                console.log('An error occured: ', data["err"]);
                this.errMsg = data["err"];
                this.isProcessing = false;
              } else {
                console.log('success: ', data);
                this.msg = data["msg"];
                this.isProcessing = false;
                this.assetName = "";
                this.initialIssuance = 0;
              }
            },
            err => { 
              console.log(err.Message);
              this.isProcessing=false;
            }
          );
      });
  }
}

