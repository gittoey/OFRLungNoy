import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-durian-master-data',
  templateUrl: './durian-master-data.component.html',
  styleUrls: ['./durian-master-data.component.scss'],
})
export class DurianMasterDataComponent implements OnInit {
  public modeCode!: string;
  public modeTitle!: string;

  constructor() {}

  ngOnInit(): void {
    this.mode('varieties','พันธุ์ทุเรียน')
  }

  mode(v: string, t : string): void {
    this.modeCode = v;
    this.modeTitle = t;
  }
}
