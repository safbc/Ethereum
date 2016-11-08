import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

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
    private router: Router ) {
  }

  ngOnInit(): void {
  }

  issue(): void {
    console.log('issue button clicked');
  }
}

