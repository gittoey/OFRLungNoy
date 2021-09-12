import {
  Component,
  OnInit,
  TemplateRef,
  Output,
  EventEmitter,
} from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Price, SystemConfig, Varieties } from 'src/app/model/db.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { environment } from 'src/environments/environment';
import { PopupService } from 'src/app/service/popup.service';
import { ShoppingCart } from 'src/app/model/sys.model';
import { DataService } from 'src/app/service/data.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  public varietiesList: Array<Varieties> = [];
  public systemConfigList: Array<SystemConfig> = [];
  public GradeOfVarietiesList: Array<SystemConfig> = [];
  public priceList: Array<Price> = [];
  public api = environment.apiHost;
  public varieties: Varieties = {
    VarietiesID: 0,
    Name: '',
    Img: '',
    Meat: '',
    Smell: '',
    Flavor: '',
    DeliciousTerm: '',
    Decs: '',
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: true,
  };

  public gradeCode: string = '';
  public gradeName: string = '';
  public price: number = 0;
  public amount: number = 0;
  public totalPrice: number = 0;

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

  @Output() shoppingCartEvent = new EventEmitter<number>();

  constructor(
    public bs: BackendService,
    public alert: AlertService,
    private spinner: NgxSpinnerService,
    public popup: PopupService,
    public dataService: DataService
  ) {}

  async ngOnInit() {
    this.spinner.show();
    this.getVarieties('');
    await this.getSystemConfig('Grade');
  }

  async getVarieties(Name: string) {
    this.bs.post('get_varieties.php', { Name: Name }).then((d: any) => {
      this.spinner.hide();
      if (d.Return.Varieties != 0) {
        this.varietiesList = d.Return.Varieties;
      } else {
        this.varietiesList = [];
      }
    });
  }

  async getSystemConfig(ConfigCode: string) {
    await this.bs.sc(ConfigCode).then((d: any) => {
      if (d.Return.SystemConfig != 0) {
        this.systemConfigList = d.Return.SystemConfig;
      }
    });
  }

  async openVarietiesDetail(content: TemplateRef<any>, varieties: Varieties) {
    this.popup.open(content);
    this.varieties = varieties;
    this.bs
      .post('get_prive.php', {
        VarietiesID: varieties.VarietiesID,
        GradeCode: '',
      })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.Price != 0) {
          this.priceList = d.Return.Price;
        } else {
          this.priceList = [];
        }

        if (this.priceList.length == 0) {
          this.alert.err(
            'ทุเรียนพันธุ์' + varieties.Name + ' ยังไม่มีการตั้งราคา'
          );
          this.popup.ref?.close();
          return;
        }

        this.GradeOfVarietiesList = this.systemConfigList.filter((el) => {
          return this.priceList.some((f) => {
            return f.GradeCode == el.ConfigValue;
          });
        });
        this.gradeCode = this.GradeOfVarietiesList[0].ConfigValue || '';
        this.gradeName = this.getGradeDisplay(this.gradeCode) || '';
        this.amount = 1;
        this.gradeOnChange();
      });
  }

  getGradeDisplay(gradeCode: string | undefined) {
    return this.systemConfigList.find((d) => d.ConfigValue == gradeCode)
      ?.ConfigDisplay;
  }

  gradeOnChange() {
    this.spinner.show();
    this.gradeName = this.getGradeDisplay(this.gradeCode) || '';
    this.bs
      .post('get_prive.php', {
        VarietiesID: this.varieties.VarietiesID,
        GradeCode: this.gradeCode,
      })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.Price != 0) {
          this.priceList = d.Return.Price;
        } else {
          this.priceList = [];
        }
        this.price =
          this.priceList[0].SellingPrice === undefined
            ? 0
            : this.priceList[0].SellingPrice;
        this.calculatePrice();
      });
  }

  calculatePrice() {
    this.totalPrice = this.price * this.amount;
  }

  save() {
    var shoppingCartList = JSON.parse(
      localStorage.getItem('shoppingCartList') || '{}'
    );
    if (shoppingCartList.length > 0) {
      this.shoppingCartList = shoppingCartList;
    }
    let index = this.shoppingCartList.findIndex(
      (x) =>
        x.VarietiesID === this.varieties.VarietiesID &&
        x.GradeCode === this.gradeCode
    );

    if (index == -1) {
      this.shoppingCart.VarietiesID = this.varieties.VarietiesID;
      this.shoppingCart.VarietiesName = this.varieties.Name || '';
      this.shoppingCart.GradeCode = this.gradeCode || '';
      this.shoppingCart.GradeName = this.gradeName || '';
      this.shoppingCart.SellingPrice = this.price;
      this.shoppingCart.Amount = this.amount;
      this.shoppingCart.TotalPrice = this.totalPrice;
      this.shoppingCartList.push(this.shoppingCart);
    } else {
      this.shoppingCartList[index].VarietiesID = this.varieties.VarietiesID;
      this.shoppingCartList[index].VarietiesName = this.varieties.Name || '';
      this.shoppingCartList[index].GradeCode = this.gradeCode || '';
      this.shoppingCartList[index].GradeName = this.gradeName || '';
      this.shoppingCartList[index].SellingPrice = this.price;
      this.shoppingCartList[index].Amount = this.amount;
      this.shoppingCartList[index].TotalPrice = this.totalPrice;
    }

    this.dataService.changeCountShoppingCart(this.shoppingCartList.length);

    localStorage.setItem(
      'shoppingCartList',
      JSON.stringify(this.shoppingCartList)
    );

    this.popup.ref?.close();

    this.alert.succ('เพิ่มทุเรียนในตะกร้าแล้ว');
  }
}
