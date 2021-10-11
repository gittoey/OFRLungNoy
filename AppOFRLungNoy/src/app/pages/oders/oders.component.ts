import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  District,
  Oder,
  OderDetail,
  Province,
  SubDistrict,
} from 'src/app/model/db.model';
import {
  Auth,
  ShoppingCart,
  SysOder,
  SysOderDetail,
} from 'src/app/model/sys.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { DataService } from 'src/app/service/data.service';
import { PopupService } from 'src/app/service/popup.service';
import { SysService } from 'src/app/service/sys.service';

@Component({
  selector: 'app-oders',
  templateUrl: './oders.component.html',
  styleUrls: ['./oders.component.scss'],
})
export class OdersComponent implements OnInit {
  private auth: Auth = {
    UserID: -1,
    AuthToken: '',
    Name: '',
    UserType: '',
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
  public sysOder: SysOder = {
    ConfigDisplay: '',
    TotalAmount: 0,
    TotalPrice: 0,
    OderID: 0,
    OderNo: '',
    UserID: 0,
    AddressText: '',
    ProvinceID: 0,
    DistrictID: 0,
    SubDistrictID: 0,
    Remark: '',
    StatusCode: '',
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: false,
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

  public sysOderDetailList: Array<SysOderDetail> = [];

  public searchOderNo: string = '';

  @Input() province: Province = {
    ProvinceID: 0,
    Code: '',
    NameInThai: '',
    NameInEnglish: '',
  };
  public provinceList: Array<Province> = [];

  @Input() district: District = {
    DistrictID: 0,
    ProvinceID: 0,
    Code: '',
    NameInThai: '',
    NameInEnglish: '',
  };
  public districtList: Array<District> = [];

  @Input() subDistrict: SubDistrict = {
    SubDistrictID: 0,
    DistrictID: 0,
    Code: '',
    NameInThai: '',
    NameInEnglish: '',
    Latitude: 0,
    Longitude: 0,
    ZipCode: 0,
  };
  public subDistrictList: Array<SubDistrict> = [];

  public shoppingCartList: Array<ShoppingCart> = [];
  public shoppingCart: ShoppingCart = {
    VarietiesID: 0,
    VarietiesName: '',
    GradeCode: '',
    GradeName: '',
    SellingPrice: 0,
    Amount: 0,
    TotalPrice: 0,
  };

  public sumTotalPrice: number = 0;
  public countShoppingCart: number = 0;

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef = {
    nativeElement: null,
  };
  public from: FormData = new FormData();

  constructor(
    private popup: PopupService,
    public alert: AlertService,
    public dataService: DataService,
    public bs: BackendService,
    private spinner: NgxSpinnerService,
    public sys: SysService
  ) {}

  async ngOnInit(): Promise<void> {
    this.auth = await this.sys.ckLogin();
    await this.getOder('');
  }

  async getOder(oderNo: string) {
    this.spinner.show();
    this.bs
      .post('get_oder.php', { UserID: this.auth.UserID, OderNo: oderNo })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.SysOder != 0) {
          this.sysOderList = d.Return.SysOder;
        } else {
          this.sysOderList = [];
        }
      });
  }

  setFromFile(event: any) {
    this.bs.setFormDataFile(this.from, 'File', event);
    this.from.append('Path', 'VarietiesImg/');
  }

  search() {
    this.getOder(this.searchOderNo);
  }

  async openOderDetail(content: TemplateRef<any>, sOder: SysOder) {
    this.oder = <Oder>sOder;
    this.getProvince();
    this.getDistrict();
    this.getSubDistrict();
    await this.getOderDetailList();
    this.popup.open_xl(content);
  }

  async openNoticeOfPayment(content: TemplateRef<any>, sOder: SysOder) {
    this.oder = <Oder>sOder;
    this.getProvince();
    this.getDistrict();
    this.getSubDistrict();
    await this.getOderDetailList();
    this.popup.open_xl(content);
  }

  async getOderDetailList() {
    this.spinner.show();
    await this.bs
      .post('get_oderdetail.php', { OderID: this.oder.OderID })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.SysOderDetail != 0) {
          this.sysOderDetailList = d.Return.SysOderDetail;
        } else {
          this.sysOderDetailList = [];
        }
        this.sysOderDetailList.forEach((a) => {
          a.TotalPrice = a.Amount * a.SellingPrice;
        });
        this.sumPrice();
        this.spinner.hide();
      });
  }

  changePrice(index: number): void {
    if (this.sysOderDetailList[index].Amount == 0) {
      this.alert.warn('กรอกราคา มากกว่า 0');
      this.sysOderDetailList[index].Amount = 1;
    }
    this.sysOderDetailList[index].TotalPrice =
      this.sysOderDetailList[index].Amount *
      this.sysOderDetailList[index].SellingPrice;
    this.sumPrice();
  }

  sumPrice() {
    this.sumTotalPrice = 0;
    this.sysOderDetailList.forEach((a) => {
      if (a.Active) {
        this.sumTotalPrice += a.TotalPrice;
      }
    });
  }

  deleteOder(oderID: number) {
    this.alert.conf('ยืนยันการลบ Oder').then(async (d) => {
      if (d.isConfirmed) {
        this.oder = {
          OderID: oderID,
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
          Active: false,
        };
        var Insert = {
          Table: 'Oder',
          Data: this.oder,
        };

        await this.bs.cu(Insert).then((d: any) => {
          if (d.Return.Status == 'Yes') {
            var msg = 'ลบรายการ Oder แล้ว';
            this.alert.succ(msg);
            this.ngOnInit();
          }
        });
      }
    });
  }

  cancelExaminePaid(oder: Oder) {
    this.alert.conf('ต้องการยกเลิกการแจ้งชำระ ใช่หรือไม่').then(async (d) => {
      if (d.isConfirmed) {
        oder = {
          OderID: oder.OderID,
          OderNo: oder.OderNo,
          UserID: oder.UserID,
          AddressText: oder.AddressText,
          ProvinceID: oder.ProvinceID,
          DistrictID: oder.DistrictID,
          SubDistrictID: oder.SubDistrictID,
          Remark: oder.Remark,
          StatusCode: 'PendingPayment',
          CreateBy: oder.CreateBy,
          UpdateBy: oder.UpdateBy,
          CreateDate: oder.CreateDate,
          UpdateDate: oder.UpdateDate,
          Active: oder.Active,
        };
        var Insert = {
          Table: 'Oder',
          Data: oder,
        };

        await this.bs.cu(Insert).then((d: any) => {
          if (d.Return.Status == 'Yes') {
            var msg = 'ยกเลิกการแจ้งชำระ แล้ว';
            this.alert.succ(msg);
            this.ngOnInit();
          }
        });
      }
    });
  }

  deleteOderDetailList(sysOderDetail: SysOderDetail) {
    this.alert.conf('ต้องการลบรายการทุเรียน ใช่หรือไม่').then((d) => {
      if (d.isConfirmed) {
        sysOderDetail.Active = false;
        this.sumPrice();
      }
    });
  }

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

  async getDistrict() {
    if (this.oder.ProvinceID == 0) {
      this.oder.DistrictID = 0;
      this.oder.SubDistrictID = 0;
      return;
    }
    this.bs
      .post('get_district.php', { ProvinceID: this.oder.ProvinceID })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.District != 0) {
          this.districtList = d.Return.District;
        } else {
          this.districtList = [];
        }
      });
  }

  async getSubDistrict() {
    if (this.oder.DistrictID == 0) {
      this.oder.SubDistrictID = 0;
      return;
    }
    this.bs
      .post('get_subdistrict.php', { DistrictID: this.oder.DistrictID })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.SubDistrict != 0) {
          this.subDistrictList = d.Return.SubDistrict;
        } else {
          this.subDistrictList = [];
        }
      });
  }

  async save() {
    if (this.sysOderDetailList.length == 0) {
      this.alert.err('ไม่มีรายการใน Oder');
      return;
    }

    this.oder.UserID = this.auth.UserID;
    this.oder.CreateBy = this.auth.UserID;
    this.oder.UpdateBy = this.auth.UserID;
    this.oder.UpdateDate = new Date();

    this.oder = {
      OderID: this.oder.OderID,
      OderNo: this.oder.OderNo,
      UserID: this.oder.UserID,
      AddressText: this.oder.AddressText,
      ProvinceID: this.oder.ProvinceID,
      DistrictID: this.oder.DistrictID,
      SubDistrictID: this.oder.SubDistrictID,
      Remark: this.oder.Remark,
      StatusCode: this.oder.StatusCode,
      CreateBy: this.oder.CreateBy,
      UpdateBy: this.oder.UpdateBy,
      CreateDate: this.oder.CreateDate,
      UpdateDate: this.oder.UpdateDate,
      Active: this.oder.Active,
    };

    let errText = '';
    if (this.oder.AddressText == '') {
      errText = 'กรอก : บ้านเลขที่, หมู่, ซอย';
    }

    if (this.oder.ProvinceID == 0) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'เลือก : จังหวัด';
    }

    if (this.oder.DistrictID == 0) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'เลือก : อำเภอ';
    }

    if (this.oder.SubDistrictID == 0) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'เลือก : ตำบล';
    }

    if (errText != '') {
      this.alert.err('**ที่อยู่จัดส่ง \n' + errText);
      return;
    }

    this.alert.conf('ยืนยันการแก้ไข Oder').then(async (d) => {
      if (d.isConfirmed) {
        var Insert = {
          Table: 'Oder',
          Data: this.oder,
        };

        await this.bs.cu(Insert).then((d: any) => {
          if (d.Return.Status == 'Yes') {
            this.sysOderDetailList.forEach((sSysOderDetail) => {
              this.oderDetail = {
                OderDetailID: sSysOderDetail.OderDetailID,
                OderID: this.oder.OderID,
                VarietiesID: sSysOderDetail.VarietiesID,
                GradeCode: sSysOderDetail.GradeCode,
                SellingPrice: sSysOderDetail.SellingPrice,
                Amount: sSysOderDetail.Amount,
                CreateBy: this.auth.UserID,
                UpdateBy: this.auth.UserID,
                CreateDate: new Date(),
                UpdateDate: new Date(),
                Active: sSysOderDetail.Active,
              };

              var Insert = {
                Table: 'OderDetail',
                Data: this.oderDetail,
              };

              this.bs.cu(Insert).then((d: any) => {
                console.log(d);

                if (d.Return.Status == 'Yes') {
                } else {
                  this.alert.err(d.Return.Message);
                  return;
                }
              });
            });

            var msg = 'แก้ไขการสั่งจองแล้ว\nกรุณาชำระและแจ้งชำระในขั้นตอนถัดไป';
            this.alert.succ(msg);

            this.oder = {
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
              Active: false,
            };

            this.shoppingCartList = [];
            this.dataService.changeCountShoppingCart(
              this.shoppingCartList.length
            );
            localStorage.setItem(
              'shoppingCartList',
              JSON.stringify(this.shoppingCartList)
            );
            this.sumPrice();
          } else {
            this.alert.err(d.Return.Message);
          }
        });
        this.spinner.hide();

        this.ngOnInit();
        this.popup.ref?.close();
      }
    });
  }
  savePayment() {
    this.oder.UserID = this.auth.UserID;
    this.oder.CreateBy = this.auth.UserID;
    this.oder.UpdateBy = this.auth.UserID;
    this.oder.UpdateDate = new Date();

    this.oder = {
      OderID: this.oder.OderID,
      OderNo: this.oder.OderNo,
      UserID: this.oder.UserID,
      AddressText: this.oder.AddressText,
      ProvinceID: this.oder.ProvinceID,
      DistrictID: this.oder.DistrictID,
      SubDistrictID: this.oder.SubDistrictID,
      Remark: this.oder.Remark,
      StatusCode: 'ExaminePaid',
      CreateBy: this.oder.CreateBy,
      UpdateBy: this.oder.UpdateBy,
      CreateDate: this.oder.CreateDate,
      UpdateDate: this.oder.UpdateDate,
      Active: this.oder.Active,
    };

    this.alert.conf('ยืนยันการแจ้งชำระ').then(async (d) => {
      if (d.isConfirmed) {
        var Insert = {
          Table: 'Oder',
          Data: this.oder,
        };

        await this.bs.cu(Insert).then((d: any) => {
          if (d.Return.Status == 'Yes') {
            this.ngOnInit();
            this.popup.ref?.close();
          }
        });
      }
    });
  }
}
