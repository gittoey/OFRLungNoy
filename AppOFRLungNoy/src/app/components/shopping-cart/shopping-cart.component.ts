import { Component, Input, OnInit, TemplateRef } from '@angular/core';
import { PopupService } from 'src/app/service/popup.service';
import { Auth, ShoppingCart } from 'src/app/model/sys.model';
import { DataService } from 'src/app/service/data.service';
import { AlertService } from 'src/app/service/alert.service';
import { Router } from '@angular/router';
import {
  Order,
  OrderDetail,
  Province,
  District,
  SubDistrict,
} from 'src/app/model/db.model';
import { BackendService } from 'src/app/service/backend.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.component.html',
  styleUrls: ['./shopping-cart.component.scss'],
})
export class ShoppingCartComponent implements OnInit {
  public order: Order = {
    OrderID: 0,
    OrderNo: '',
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

  public orderDetail: OrderDetail = {
    OrderDetailID: 0,
    OrderID: 0,
    VarietiesID: 0,
    GradeCode: '',
    SellingPrice: 0,
    Amount: 0,
    Unit:1,
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: true,
  };
  public orderDetailList: Array<OrderDetail> = [];

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
    Unit: 1,
    TotalPrice: 0,
  };

  public sumTotalPrice: number = 0;
  public countShoppingCart: number = 0;

  private auth: Auth = {
    UserID: -1,
    AuthToken: '',
    Name: '',
    UserType: ''
  };

  constructor(
    private popup: PopupService,
    public alert: AlertService,
    public dataService: DataService,
    public bs: BackendService,
    private router: Router,
    private spinner: NgxSpinnerService
  ) {}

  ngOnInit(): void {
    this.getShoppingCartList();
    this.dataService.currentCountShoppingCart.subscribe(
      (countShoppingCart) => (this.countShoppingCart = countShoppingCart)
    );
  }

  private popupRef: any;
  openShoppingCart(content: TemplateRef<any>) {
    this.getShoppingCartList();
    this.province.ProvinceID = 0;
    this.getProvince();
    this.popupRef = this.popup.open_xl(content);
  }

  getShoppingCartList() {
    var shoppingCartList = JSON.parse(
      localStorage.getItem('shoppingCartList') || '{}'
    );
    if (shoppingCartList.length) {
      this.shoppingCartList = shoppingCartList || [];
    }

    this.dataService.changeCountShoppingCart(this.shoppingCartList.length);
    this.sumPrice();
  }

  changePrice(index: number) {
    if (this.shoppingCartList[index].Amount == 0) {
      this.alert.warn('กรอกราคา มากกว่า 0');
      this.shoppingCartList[index].Amount = 1;
    }

    this.shoppingCartList[index].TotalPrice =
      this.shoppingCartList[index].Amount *
      (this.shoppingCartList[index].Unit == 1 ? this.shoppingCartList[index].SellingPrice : this.shoppingCartList[index].SellingPrice * 1000);
    localStorage.setItem(
      'shoppingCartList',
      JSON.stringify(this.shoppingCartList)
    );
    this.sumPrice();
  }

  deleteShoppingCartList(shoppingCart: ShoppingCart) {
    this.alert.conf('ต้องการลบรายการทุเรียน ใช่หรือไม่').then((d) => {
      if (d.isConfirmed) {
        this.shoppingCartList = this.shoppingCartList.filter(
          (obj) => obj !== shoppingCart
        );
        this.dataService.changeCountShoppingCart(this.shoppingCartList.length);
        localStorage.setItem(
          'shoppingCartList',
          JSON.stringify(this.shoppingCartList)
        );
        this.sumPrice();
      }
    });
  }

  sumPrice() {
    this.sumTotalPrice = 0;
    this.shoppingCartList.forEach((a) => (this.sumTotalPrice += a.TotalPrice));
  }

  async save() {
    if (this.shoppingCartList.length == 0) {
      this.alert.err("ไม่มีรายการในตะกร้า");
      return;
    }

    this.popupRef?.close();
    this.auth = JSON.parse(localStorage.getItem('currentUser') || '{}');

    if(this.auth.UserID === undefined){
      this.router.navigate(['/login']);
      return;
    }

    this.order.UserID = this.auth.UserID;
    this.order.CreateBy = this.auth.UserID;
    this.order.UpdateBy = this.auth.UserID;

    let errText = '';
    if (this.order.AddressText == '') {
      errText = 'กรอก : บ้านเลขที่, หมู่, ซอย';
    }

    if (this.order.ProvinceID == 0) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'เลือก : จังหวัด';
    }

    if (this.order.DistrictID == 0) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'เลือก : อำเภอ';
    }

    if (this.order.SubDistrictID == 0) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'เลือก : ตำบล';
    }

    if (errText != '') {
      this.alert.err('**ที่อยู่จัดส่ง \n' + errText);
      return;
    }

    var Insert = {
      Table: 'Order',
      Data: this.order,
    };

    await this.bs.cu(Insert).then((d: any) => {
      if (d.Return.Status == 'Yes') {
        this.shoppingCartList.forEach((sShoppingCart) => {
          this.orderDetail = {
            OrderDetailID: 0,
            OrderID: d.Return.insert_id,
            VarietiesID: sShoppingCart.VarietiesID,
            GradeCode: sShoppingCart.GradeCode,
            SellingPrice: sShoppingCart.SellingPrice,
            Amount: sShoppingCart.Amount,
            Unit: sShoppingCart.Unit,
            CreateBy: this.auth.UserID,
            UpdateBy: this.auth.UserID,
            CreateDate: new Date(),
            UpdateDate: new Date(),
            Active: true,
          };

          var Insert = {
            Table: 'OrderDetail',
            Data: this.orderDetail,
          };

          this.bs.cu(Insert).then((d: any) => {
            if (d.Return.Status == 'Yes') {
            } else {
              this.alert.err(d.Return.Message);
              return;
            }
          });
        });

        var msg = 'ยืนยันการสั่งจองแล้ว\nกรุณาชำระและแจ้งชำระค่ามัดจำ 10% ในขั้นตอนถัดไป';
        this.alert.succ(msg);

        this.order = {
          OrderID: 0,
          OrderNo: '',
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
        this.dataService.changeCountShoppingCart(this.shoppingCartList.length);
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

    this.router.navigate(['/orders']);
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
    if (this.order.ProvinceID == 0) {
      this.order.DistrictID = 0;
      this.order.SubDistrictID = 0;
      return;
    }
    this.bs
      .post('get_district.php', { ProvinceID: this.order.ProvinceID })
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
    if (this.order.DistrictID == 0) {
      this.order.SubDistrictID = 0;
      return;
    }
    this.bs
      .post('get_subdistrict.php', { DistrictID: this.order.DistrictID })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.SubDistrict != 0) {
          this.subDistrictList = d.Return.SubDistrict;
        } else {
          this.subDistrictList = [];
        }
      });
  }
}
