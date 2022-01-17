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
  Order,
  OrderDetail,
  OrderPayment,
  Price,
  Province,
  SubDistrict,
} from 'src/app/model/db.model';
import {
  Auth,
  ShoppingCart,
  SysCheckOrder,
  SysOrder,
  SysOrderDetail,
} from 'src/app/model/sys.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { DataService } from 'src/app/service/data.service';
import { PopupService } from 'src/app/service/popup.service';
import { SysService } from 'src/app/service/sys.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-check-order',
  templateUrl: './check-order.component.html',
  styleUrls: ['./check-order.component.scss']
})
export class CheckOrderComponent implements OnInit {
  public payDate: string = '';


  private auth: Auth = {
    UserID: -1,
    AuthToken: '',
    Name: '',
    UserType: '',
  };

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
  public sysOrder: SysOrder = {
    ConfigDisplay: '',
    TotalAmount: 0,
    TotalPrice: 0,
    OrderID: 0,
    OrderNo: '',
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
  public sysCheckOrderList: Array<SysCheckOrder> = [];

  public orderDetail: OrderDetail = {
    OrderDetailID: 0,
    OrderID: 0,
    VarietiesID: 0,
    GradeCode: '',
    SellingPrice: 0,
    Amount: 0,
    Unit: 1,
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: true,
  };
  public orderDetailList: Array<OrderDetail> = [];

  public sysOrderDetailList: Array<SysOrderDetail> = [];

  public searchOrderNo: string = '';
  public searchOrderByName: string = '';

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

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef = {
    nativeElement: null,
  };
  public from: FormData = new FormData();

  public orderPayment: OrderPayment = {
    OrderPaymentID: 0,
    OrderID: 0,
    PaymentDate: '',
    PaymentImg: '',
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: false,
  };

  public api = environment.apiHost;

  constructor(
    private popup: PopupService,
    public alert: AlertService,
    public dataService: DataService,
    public bs: BackendService,
    private spinner: NgxSpinnerService,
    public sys: SysService
  ) { }

  async ngOnInit(): Promise<void> {
    this.auth = await this.sys.ckLogin();
    await this.getOrder('', '');
  }

  async getOrder(orderByName: string, orderNo: string) {
    this.spinner.show();
    this.bs
      .post('get_check_order.php', { UserID: this.auth.UserID, OrderNo: orderNo, OrderByName: orderByName })
      .then((d: any) => {
        console.log(d);

        this.spinner.hide();
        if (d.Return.SysCheckOrder != 0) {
          this.sysCheckOrderList = d.Return.SysCheckOrder;
        } else {
          this.sysCheckOrderList = [];
        }
      });
  }

  setFromFile(event: any) {
    this.bs.setFormDataFile(this.from, 'File', event);
    this.from.append('Path', 'VarietiesImg/');
  }

  search() {
    this.getOrder(this.searchOrderByName, this.searchOrderNo);
  }


  private popupRef: any;
  async openOrderDetail(content: TemplateRef<any>, sOrder: SysOrder) {
    this.order = <Order>sOrder;
    this.getProvince();
    this.getDistrict();
    this.getSubDistrict();
    await this.getOrderDetailList();
    this.popupRef = this.popup.open_xl(content);
  }

  openImg(content: TemplateRef<any>) {
    this.popup.open_lg(content);
  }

  async getOrderDetailList() {
    this.spinner.show();
    await this.bs
      .post('get_orderdetail.php', { OrderID: this.order.OrderID })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.SysOrderDetail != 0) {
          this.sysOrderDetailList = d.Return.SysOrderDetail;
        } else {
          this.sysOrderDetailList = [];
        }
        this.sysOrderDetailList.forEach((a) => {
          a.TotalPrice = (a.Amount * a.SellingPrice) * (a.Unit == 1 ? 1 : 1000);
        });
        this.sumPrice();
        this.spinner.hide();
      });

    await this.bs
      .post('get_check_order_d.php', { OrderID: this.order.OrderID })
      .then((d: any) => {
        console.log(d);
        if (d.Return.OrderPayment != 0) {
          this.orderPayment = d.Return.OrderPayment[0];
        } else {
          this.orderPayment = {
            OrderPaymentID: 0,
            OrderID: 0,
            PaymentDate: '',
            PaymentImg: '',
            CreateBy: 0,
            UpdateBy: 0,
            CreateDate: new Date(),
            UpdateDate: new Date(),
            Active: false,
          };
        }
      });

  }

  changePrice(index: number): void {
    if (this.sysOrderDetailList[index].Amount == 0) {
      this.alert.warn('กรอกราคา มากกว่า 0');
      this.sysOrderDetailList[index].Amount = 1;
    }
    this.sysOrderDetailList[index].TotalPrice =
      (this.sysOrderDetailList[index].Amount * this.sysOrderDetailList[index].SellingPrice) * (this.sysOrderDetailList[index].Unit == 1 ? 1 : 1000);
    this.sumPrice();
  }

  sumPrice() {
    this.sumTotalPrice = 0;
    this.sysOrderDetailList.forEach((a) => {
      if (a.Active) {
        console.log(a);

        this.sumTotalPrice += a.TotalPrice * (a.Unit == 1 ? 1 : 1000);
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

  async save() {
    if (this.sysOrderDetailList.length == 0) {
      this.alert.err('ไม่มีรายการใน Order');
      return;
    }

    this.order.UserID = this.auth.UserID;
    this.order.CreateBy = this.auth.UserID;
    this.order.UpdateBy = this.auth.UserID;
    this.order.UpdateDate = new Date();

    this.order = {
      OrderID: this.order.OrderID,
      OrderNo: this.order.OrderNo,
      UserID: this.order.UserID,
      AddressText: this.order.AddressText,
      ProvinceID: this.order.ProvinceID,
      DistrictID: this.order.DistrictID,
      SubDistrictID: this.order.SubDistrictID,
      Remark: this.order.Remark,
      StatusCode: this.order.StatusCode,
      CreateBy: this.order.CreateBy,
      UpdateBy: this.order.UpdateBy,
      CreateDate: this.order.CreateDate,
      UpdateDate: this.order.UpdateDate,
      Active: this.order.Active,
    };

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

    this.alert.conf('ยืนยันการแก้ไข Order').then(async (d) => {
      if (d.isConfirmed) {
        var Insert = {
          Table: 'Order',
          Data: this.order,
        };

        await this.bs.cu(Insert).then((d: any) => {
          if (d.Return.Status == 'Yes') {
            this.sysOrderDetailList.forEach((sSysOrderDetail) => {
              this.orderDetail = {
                OrderDetailID: sSysOrderDetail.OrderDetailID,
                OrderID: this.order.OrderID,
                VarietiesID: sSysOrderDetail.VarietiesID,
                GradeCode: sSysOrderDetail.GradeCode,
                SellingPrice: sSysOrderDetail.SellingPrice,
                Amount: sSysOrderDetail.Amount,
                Unit: sSysOrderDetail.Unit,
                CreateBy: this.auth.UserID,
                UpdateBy: this.auth.UserID,
                CreateDate: new Date(),
                UpdateDate: new Date(),
                Active: sSysOrderDetail.Active,
              };

              var Insert = {
                Table: 'OrderDetail',
                Data: this.orderDetail,
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
  savePayment(statusCode: string) {
    let textMSG = '';
    if (statusCode == "RejectPaid") {
      textMSG = 'ยืนยันการปฏิเสธการชำระเงิน';
    } else {
      textMSG = 'ยืนยันการตรวจสอบแจ้งชำระ';
    }

    this.alert.conf(textMSG).then(async (d) => {
      if (d.isConfirmed) {

        this.order.UpdateBy = this.auth.UserID;
        this.order.UpdateDate = new Date();

        this.order = {
          OrderID: this.order.OrderID,
          OrderNo: this.order.OrderNo,
          UserID: this.order.UserID,
          AddressText: this.order.AddressText,
          ProvinceID: this.order.ProvinceID,
          DistrictID: this.order.DistrictID,
          SubDistrictID: this.order.SubDistrictID,
          Remark: this.order.Remark,
          StatusCode: statusCode,
          CreateBy: this.order.CreateBy,
          UpdateBy: this.order.UpdateBy,
          CreateDate: this.order.CreateDate,
          UpdateDate: this.order.UpdateDate,
          Active: this.order.Active,
        };


        var Insert = {
          Table: 'Order',
          Data: this.order,
        };

        await this.bs.cu(Insert).then((d: any) => {
          if (d.Return.Status == 'Yes') {

            if (statusCode == 'Paid') {
              this.updateStock(this.sysCheckOrderList[0].OrderID);
            }

            var msg = 'ตรวจสอบการแจ้งชำระแล้ว';
            this.alert.succ(msg);
            this.ngOnInit();
            this.popupRef?.close();
          }
        });
      }
    });
  }

  updateStock(orderID: number) {
    this.bs
      .post('get_orderdetail.php', { OrderID: orderID })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.SysOrderDetail != 0) {
          d.Return.SysOrderDetail.forEach((a: SysOrderDetail) => {
            this.bs
              .post('get_prive.php', {
                VarietiesID: a.VarietiesID,
                GradeCode: a.GradeCode,
              })
              .then((d: any) => {
                this.spinner.hide();
                if (d.Return.Price != 0) {
                  d.Return.Price;
                  d.Return.Price.forEach((p: Price) => {
                    p.Stock = p.Stock - (a.Unit == 1 ? a.Amount : (a.Amount * 1000));

                    var Insert = {
                      Table: 'Price',
                      Data: p,
                    };

                    this.bs.cu(Insert).then((d: any) => {
                      if (d.Return.Status == 'Yes') { }
                    });
                  });
                }
              });
          });
        }
      });
  }
}
