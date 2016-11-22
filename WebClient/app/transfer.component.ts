import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TypeaheadModule } from 'ng2-bootstrap/ng2-bootstrap';
import { AssetService } from './asset.service';

@Component({
  moduleId: module.id,
  selector: 'my-dashboard',
  templateUrl: 'transfer.component.html',
  styleUrls: [ 'transfer.component.css' ]
})

export class TransferComponent implements OnInit {

  private assets: Array<string> = [];
  private selectedAsset: string='';

  constructor(private router: Router, private assetService: AssetService) {
  }

  ngOnInit(): void {
    this.assetService.getListOfAssets()
			.subscribe(
				data => {
          console.log('data:', data);
          for(var index in data){
            this.assets.push(data[index]["contractName"]);
          }
          console.log('assets: ', this.assets);
        },
				err => { console.log('err:', err); }
      );
  }

  typeaheadOnSelect(e: any) {
    console.log('Selected value:', e);
  }
}

