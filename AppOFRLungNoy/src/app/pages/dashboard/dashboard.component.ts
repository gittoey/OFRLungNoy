import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Varieties } from 'src/app/model/db.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  public varietiesList: Array<Varieties> = [];
  public api = environment.apiHost;

  constructor(
    public bs: BackendService,
    public alert: AlertService,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit() {
    this.getVarieties('');
  }

  async getVarieties(Name: string) {
    this.bs.post('get_varieties.php', { Name: Name }).then((d: any) => {
      console.log(d);
      this.spinner.hide();
      if (d.Return.Varieties != 0) {
        this.varietiesList = d.Return.Varieties;
      } else {
        this.varietiesList = [];
      }
    });
  }
}
