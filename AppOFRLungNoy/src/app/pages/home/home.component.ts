import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Feed } from 'src/app/model/db.model';
import { BackendService } from 'src/app/service/backend.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  
  public api = environment.apiHost;
  public feedList: Array<Feed> = [];

  constructor(
    public bs: BackendService,
    private spinner: NgxSpinnerService
    ) { }

  ngOnInit(): void {
    this.getFeed("");
  }

  async getFeed(Title: string) {
    this.bs.post('get_feeds.php', { Title: Title }).then((d: any) => {
      this.spinner.hide();
      if (d.Return.Feed != 0) {
        this.feedList = d.Return.Feed;
      } else {
        this.feedList = [];
      }
    });
  }

}
