import { Component, Input, OnInit } from '@angular/core';
import { SysService } from 'src/app/service/sys.service';
import { Auth } from 'src/app/model/sys.model';
import { BackendService } from 'src/app/service/backend.service';
import { District, Province, SubDistrict, User } from 'src/app/model/db.model';
import { NgxSpinnerService } from 'ngx-spinner';
import { AlertService } from 'src/app/service/alert.service';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
})
export class UserProfileComponent implements OnInit {
  public auth: Auth = {
    UserID: -1,
    AuthToken: '',
    Name: '',
    UserType: ''
  };

  @Input()  user: User = {
    UserID: 0,
    Type: '',
    Username: '',
    Password: '',
    Name: '',
    AddressText: '',
    ProvinceID: 0,
    DistrictID: 0,
    SubDistrictID: 0,
    Active: false,
    NewDate: new Date(),
    UpdateDate: new Date()
  };

  public isEdit: boolean = false;

  constructor(
    private sysService: SysService,
    public alert: AlertService,
    public dataService: DataService,
    private spinner: NgxSpinnerService,
    private bs: BackendService
  ) { }

  async ngOnInit() {
    this.auth = await JSON.parse(
      localStorage.getItem('currentUser') || "{}"
    );

    await this.getUser();

    this.getProvince();
    this.getDistrict();
    this.getSubDistrict();
  }

  isEditSave() {
    this.isEdit = this.isEdit ? false : true;
  }

  async getUser() {
    await this.bs.post('get_user.php', { UserID: this.auth.UserID }).then((d: any) => {
      console.log(d);

      if (d.Return.Varieties != 0) {
        this.user = d.Return.User;
      } else {
        this.user = {
          UserID: 0,
          Type: '',
          Username: '',
          Password: '',
          Name: '',
          AddressText: '',
          ProvinceID: 0,
          DistrictID: 0,
          SubDistrictID: 0,
          Active: false,
          NewDate: new Date(),
          UpdateDate: new Date()
        };;
      }
    });

    this.user.ProvinceID = this.user.ProvinceID == null ? 0 : this.user.ProvinceID;
    this.user.DistrictID = this.user.DistrictID == null ? 0 : this.user.DistrictID;
    this.user.SubDistrictID = this.user.SubDistrictID == null ? 0 : this.user.SubDistrictID;
  }


  public provinceList: Array<Province> = [];
  async getProvince() {
    this.bs.post('get_province.php', {}).then((d: any) => {
      this.spinner.hide();
      if (d.Return.Province != 0) {
        this.provinceList = d.Return.Province;
      } else {
        this.provinceList = [];
      }
    });
  }


  public districtList: Array<District> = [];
  async getDistrict() {
    if (this.user.ProvinceID == 0) {
      this.user.DistrictID = 0;
      this.user.SubDistrictID = 0;
      return;
    }
    this.bs
      .post('get_district.php', { ProvinceID: this.user.ProvinceID })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.District != 0) {
          this.districtList = d.Return.District;
        } else {
          this.districtList = [];
        }
      });
  }

  public subDistrictList: Array<SubDistrict> = [];
  async getSubDistrict() {
    if (this.user.DistrictID == 0) {
      this.user.SubDistrictID = 0;
      return;
    }
    this.bs
      .post('get_subdistrict.php', { DistrictID: this.user.DistrictID })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.SubDistrict != 0) {
          this.subDistrictList = d.Return.SubDistrict;
        } else {
          this.subDistrictList = [];
        }
      });
  }

  async saveUser() {
    var Insert = {
      Table: 'User',
      Data: this.user,
    };

    await this.bs.cu(Insert).then((d: any) => {
      if (d.Return.Status == 'Yes') {
        var msg = 'บันทึกข้อมูลผู้ใช้ แล้ว';
        this.alert.succ(msg);

        this.auth = JSON.parse(
          localStorage.getItem('currentUser') || "{}"
        );

        this.auth.Name = this.user.Name;
        localStorage.setItem('currentUser', JSON.stringify(this.auth||""));
        this.dataService.changeUserName(this.auth.Name);
        this.ngOnInit();
      }
    });
  }
}
