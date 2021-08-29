import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-durian-master-data',
  templateUrl: './durian-master-data.component.html',
  styleUrls: ['./durian-master-data.component.scss'],
})
export class DurianMasterDataComponent implements OnInit {
  public modeCode!: string;
  public modeTitle!: string;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.modeCode = params['modeCode'];
      this.modeTitle = params['modeTitle'];

      if(this.modeCode == undefined){
        this.mode('varieties','พันธุ์ทุเรียน')
      }
  });
  }

  ngOnInit(): void {
    
  }

  mode(c: string, t : string): void {
    this.modeCode = c;
    this.modeTitle = t;

    this.router.navigate(
      [], 
      {
        relativeTo: this.activatedRoute,
        queryParams: {modeCode:c, modeTitle:t}, 
        queryParamsHandling: 'merge'
      });
  }
}
