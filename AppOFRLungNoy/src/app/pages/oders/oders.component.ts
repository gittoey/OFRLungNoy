import { Component, OnInit } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Oder, OderDetail } from 'src/app/model/db.model';
import { Auth, SysOder } from 'src/app/model/sys.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { DataService } from 'src/app/service/data.service';
import { PopupService } from 'src/app/service/popup.service';
import { SysService } from 'src/app/service/sys.service';

@Component({
  selector: 'app-oders',
  templateUrl: './oders.component.html',
  styleUrls: ['./oders.component.scss']
})
export class OdersComponent implements OnInit {

  private auth: Auth = {
    UserID: -1,
    AuthToken: '',
    Name: '',
  };

  public oder: Oder = {
    OderID: 0,
    OderNo: '',
    UserID: 0,
    AddressText: '',
    ProvinceID: 0,
    DistrictID: 0,
    SubDistrictID: 0,
    Remark: '',
    StatusCode: '<null>',
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: true,
  };
  public sysOderList: Array<SysOder> = [];

  public oderDetail: OderDetail = {
    OderDetailID: 0,
    OderID: 0,
    VarietiesID: 0,
    GradeCode: '',
    SellingPrice: 0,
    Amount: 0,
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: true,
  };
  public oderDetailList: Array<OderDetail> = [];

  public searchOderNo: string = "";

  constructor(
    private popup: PopupService,
    public alert: AlertService,
    public dataService: DataService,
    public bs: BackendService,
    private spinner: NgxSpinnerService,
    public sys: SysService,
  ) { }

  async ngOnInit(): Promise<void> {
    this.auth = await this.sys.ckLogin();
    await this.getDistrict('');
  }

  async getDistrict(oderNo :string) {
    this.bs
      .post('get_oder.php', { UserID : this.auth.UserID, OderNo: oderNo })
      .then((d: any) => {
        console.log(d);
        this.spinner.hide();
        if (d.Return.SysOder != 0) {
          this.sysOderList = d.Return.SysOder;
        } else {
          this.sysOderList = [];
        }
      });
  }

  search() {
    this.spinner.show();
    this.getDistrict(this.searchOderNo);
    
  }
}
