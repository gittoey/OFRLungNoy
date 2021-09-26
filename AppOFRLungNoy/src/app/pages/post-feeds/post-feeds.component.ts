import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Feed } from 'src/app/model/db.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { environment } from 'src/environments/environment';
@Component({
  selector: 'post-feeds',
  templateUrl: './post-feeds.component.html',
  styleUrls: ['./post-feeds.component.scss']
})
export class PostFeedsComponent implements OnInit {

  public api = environment.apiHost;
  public searchTitle: string = '';
  public feedList: Array<Feed> = [];
  public isEdit: boolean = false;

  @Input() feed :Feed = {
    FeedID: 0,
    Title: '',
    Img: '',
    Text: '',
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: true
  }
  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef = {
    nativeElement: null,
  };
  public from: FormData = new FormData();

  constructor(
    public bs: BackendService,
    public alert: AlertService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    await this.getFeed("");
  }
  
  deleteImg() {
    this.feed.Img = "";
    this.from.delete('File');
    this.InputVar.nativeElement.value = '';
  }

  setFromFile(event: any) {
    this.bs.setFormDataFile(this.from, 'File', event);
    this.from.append('Path', 'FeedImg/');
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

  search() {
    this.spinner.show();
    this.getFeed(this.searchTitle);
  }

  async save() {
    let errText = '';
    if (this.feed.Title == '') {
      errText = 'กรอก : ชื่อเรื่อง';
    }

    if (this.feed.Text == '') {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : เนื้อหาข่าว';
    }


    if (errText != '') {
      this.alert.err(errText);
      return;
    }

    
    this.spinner.show();

    let PathFile: string = '';

    if(this.feed.Img != ""){
      await this.bs.uploadFile(this.from).then((d: any) => {
        PathFile = d.PathFileName;
      });
    }

    if (this.from.get('File')) {
      this.feed.Img = PathFile.toString();
    }

    var Conn = {
      Table: 'Feed',
      Data: this.feed,
    };

    this.bs.cu(Conn).then((d: any) => {
      this.spinner.hide();
      if (d.Return.Status == 'Yes') {
        this.feed = {
          FeedID: 0,
          Title: '',
          Img: '',
          Text: '',
          CreateBy: 0,
          UpdateBy: 0,
          CreateDate: new Date(),
          UpdateDate: new Date(),
          Active: true
        };
        this.from.delete('File');
        this.InputVar.nativeElement.value = '';

        var msg = '';
        if (this.isEdit) {
          msg = 'แก้ไขการแจ้งข่าว สำเร็จ';
        } else {
          msg = 'แจ้งข่าว สำเร็จ';
        }
        this.alert.succ(msg);
        this.getFeed('');
        this.isEdit = false;
      } else {
        this.alert.err(d.Return.Message);
      }
    });
  }

  edit(afeed: Feed) {
    this.isEdit = true;
    this.feed = afeed;
    this.alert.warn('ไม่เลือกรูป = ไม่แก้รูป');
  }

  delete(feedID: number) {
    this.alert.conf('ยืนยันการลบ ใช่หรือไม่').then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.feed = {
          FeedID: feedID,
          Title: '',
          Img: '',
          Text: '',
          CreateBy: 0,
          UpdateBy: 0,
          CreateDate: new Date(),
          UpdateDate: new Date(),
          Active: false,
        };

        var Update = {
          Table: 'Feed',
          Data: this.feed,
        };

        this.bs.cu(Update).then((d: any) => {
          this.spinner.hide();
          this.alert.succ('ลบการแจ้งข่าว สำเร็จ');
          this.getFeed('');
        });
      }
    });
  }

  cancel() {
    this.alert.conf('ยืนยันการยกเลิก ใช่หรือไม่').then((result) => {
      if (result.isConfirmed) {
        this.feed = {
          FeedID: 0,
          Title: '',
          Img: '',
          Text: '',
          CreateBy: 0,
          UpdateBy: 0,
          CreateDate: new Date(),
          UpdateDate: new Date(),
          Active: true
        };
        this.from.delete('File');
        this.InputVar.nativeElement.value = '';
        this.isEdit = false;
      }
    });
  }
}
