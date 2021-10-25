import {
  Component,
  ElementRef,
  Input,
  OnInit,
  TemplateRef,
  ViewChild,
} from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import {
  District,
  Order,
  OrderDetail,
  OrderPayment,
  Province,
  SubDistrict,
} from 'src/app/model/db.model';
import { Auth, SysOrder, SysOrderDetail } from 'src/app/model/sys.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { DataService } from 'src/app/service/data.service';
import { PopupService } from 'src/app/service/popup.service';
import { SysService } from 'src/app/service/sys.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
})
export class OrdersComponent implements OnInit {
  public receiptURL: SafeResourceUrl | undefined;
  public payDate: any;

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
  public sysOrderList: Array<SysOrder> = [];

  public orderDetail: OrderDetail = {
    OrderDetailID: 0,
    OrderID: 0,
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
  public orderDetailList: Array<OrderDetail> = [];

  public sysOrderDetailList: Array<SysOrderDetail> = [];

  public searchOrderNo: string = '';

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

  public sumTotalPrice: number = 0;

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

  constructor(
    private popup: PopupService,
    public alert: AlertService,
    public dataService: DataService,
    public bs: BackendService,
    private spinner: NgxSpinnerService,
    public sys: SysService,
    private sanitizer: DomSanitizer
  ) {}

  async ngOnInit(): Promise<void> {
    this.auth = await this.sys.ckLogin();
    await this.getOrder('');
  }

  async getOrder(orderNo: string) {
    this.spinner.show();
    this.bs
      .post('get_order.php', { UserID: this.auth.UserID, OrderNo: orderNo })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.SysOrder != 0) {
          this.sysOrderList = d.Return.SysOrder;
        } else {
          this.sysOrderList = [];
        }
      });
  }

  setFromFile(event: any) {
    this.bs.setFormDataFile(this.from, 'File', event);
    this.from.append('Path', 'OrderPayment/');
  }

  search() {
    this.getOrder(this.searchOrderNo);
  }

  async openReceipt(content: TemplateRef<any>, sOrder: SysOrder) {
    this.order = <Order>sOrder;
    this.receiptURL = this.sanitizer.bypassSecurityTrustResourceUrl(environment.apiHost+"pdfreceipt.php?OrderID="+this.order.OrderID);
    this.popup.open_xl(content);
  }

  async openOrderDetail(content: TemplateRef<any>, sOrder: SysOrder) {
    this.order = <Order>sOrder;
    this.getProvince();
    this.getDistrict();
    this.getSubDistrict();
    await this.getOrderDetailList();
    this.popup.open_xl(content);
  }

  async openNoticeOfPayment(content: TemplateRef<any>, sOrder: SysOrder) {
    this.order = <Order>sOrder;
    this.getProvince();
    this.getDistrict();
    this.getSubDistrict();
    await this.getOrderDetailList();
    this.popup.open_xl(content);
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
          a.TotalPrice = a.Amount * a.SellingPrice;
        });
        this.sumPrice();
        this.spinner.hide();
      });
  }

  changePrice(index: number): void {
    if (this.sysOrderDetailList[index].Amount == 0) {
      this.alert.warn('กรอกราคา มากกว่า 0');
      this.sysOrderDetailList[index].Amount = 1;
    }
    this.sysOrderDetailList[index].TotalPrice =
      this.sysOrderDetailList[index].Amount *
      this.sysOrderDetailList[index].SellingPrice;
    this.sumPrice();
  }

  sumPrice() {
    this.sumTotalPrice = 0;
    this.sysOrderDetailList.forEach((a) => {
      if (a.Active) {
        this.sumTotalPrice += a.TotalPrice;
      }
    });
  }

  deleteOrder(orderID: number) {
    this.alert.conf('ยืนยันการลบ Order').then(async (d) => {
      if (d.isConfirmed) {
        this.order = {
          OrderID: orderID,
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
        var Insert = {
          Table: 'Order',
          Data: this.order,
        };

        await this.bs.cu(Insert).then((d: any) => {
          if (d.Return.Status == 'Yes') {
            var msg = 'ลบรายการ Order แล้ว';
            this.alert.succ(msg);
            this.ngOnInit();
          }
        });
      }
    });
  }

  async saveOrderPayment(
    orderID: number,
    paymentDate: string,
    paymentImg: string
  ): Promise<number> {
    this.orderPayment = {
      OrderPaymentID: 0,
      OrderID: orderID,
      PaymentDate: paymentDate,
      PaymentImg: paymentImg,
      CreateBy: this.order.CreateBy,
      UpdateBy: this.order.UpdateBy,
      CreateDate: new Date(),
      UpdateDate: new Date(),
      Active: true,
    };
    var Insert = {
      Table: 'OrderPayment',
      Data: this.orderPayment,
    };

    console.log(Insert);

    let lReturn = 1;

    await this.bs.cu(Insert).then((d: any) => {
      console.log(d);
      
      if (d.Return.Status != 'Yes') {
        var msg = 'บันทึกข้อมูลการชำระไม่สำเร็จ';
        this.alert.err(msg);
        lReturn = 0;
      }
    });

    return lReturn;
  }

  cancelExaminePaid(order: Order) {
    this.alert.conf('ต้องการยกเลิกการแจ้งชำระ ใช่หรือไม่').then(async (d) => {
      if (d.isConfirmed) {
        order = {
          OrderID: order.OrderID,
          OrderNo: order.OrderNo,
          UserID: order.UserID,
          AddressText: order.AddressText,
          ProvinceID: order.ProvinceID,
          DistrictID: order.DistrictID,
          SubDistrictID: order.SubDistrictID,
          Remark: order.Remark,
          StatusCode: 'PendingPayment',
          CreateBy: order.CreateBy,
          UpdateBy: order.UpdateBy,
          CreateDate: order.CreateDate,
          UpdateDate: order.UpdateDate,
          Active: order.Active,
        };
        var Insert = {
          Table: 'Order',
          Data: order,
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

  deleteOrderDetailList(sysOrderDetail: SysOrderDetail) {
    this.alert.conf('ต้องการลบรายการทุเรียน ใช่หรือไม่').then((d) => {
      if (d.isConfirmed) {
        sysOrderDetail.Active = false;
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
    let errText = '';
    if (this.payDate == undefined) {
      errText = 'เลือก : วันที่ชำระ';
    }

    if (!this.from.get('File')) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'เลือก : ภาพหลักฐานการชำระ';
    }

    if (errText != '') {
      this.alert.err(errText);
      return;
    }

    this.alert.conf('ยืนยันการแจ้งชำระ').then(async (d) => {
      if (d.isConfirmed) {
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
          StatusCode: 'ExaminePaid',
          CreateBy: this.order.CreateBy,
          UpdateBy: this.order.UpdateBy,
          CreateDate: this.order.CreateDate,
          UpdateDate: this.order.UpdateDate,
          Active: this.order.Active,
        };

        let PathFile: string = '';

        await this.bs.uploadFile(this.from).then((d: any) => {
          PathFile = d.PathFileName;
        });

        let ops = await this.saveOrderPayment(
          this.order.OrderID,
          this.payDate.year.toString()+'-'+this.payDate.month.toString()+'-'+this.payDate.day.toString(),
          PathFile
        );        

        if ((ops = 0)) {
          this.alert.err('บันทึกการแจ้งชำระไม่สำเร็จ');
          this.popup.ref?.close();
          return;
        }

        var Insert = {
          Table: 'Order',
          Data: this.order,
        };

        await this.bs.cu(Insert).then((d: any) => {
          if (d.Return.Status == 'Yes') {
            this.alert.succ('บันทึกการแจ้งชำระสำเร็จ');
            this.ngOnInit();
            this.popup.ref?.close();
          }
        });
      }
    });
  }
}
