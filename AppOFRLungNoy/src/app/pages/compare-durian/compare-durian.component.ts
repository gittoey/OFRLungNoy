import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Price, SystemConfig, Varieties } from 'src/app/model/db.model';
import { ShoppingCart } from 'src/app/model/sys.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { DataService } from 'src/app/service/data.service';
import { PopupService } from 'src/app/service/popup.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-compare-durian',
  templateUrl: './compare-durian.component.html',
  styleUrls: ['./compare-durian.component.scss']
})
export class CompareDurianComponent implements OnInit {

  public api = environment.apiHost;
  public varietiesList: Array<Varieties> = [];
  public priceList: Array<Price> = [];
  public varietiesID1: number = 0;
  public varietiesID2: number = 0;
  public systemConfigList: Array<SystemConfig> = [];

  public gradePrice1: string = '';
  public gradePrice2: string = '';

  public varieties1: Varieties = {
    VarietiesID: 0,
    UpdateBy: 0,
    UpdateDate: new Date(),
    Active: false
  };

  public varieties2: Varieties = {
    VarietiesID: 0,
    UpdateBy: 0,
    UpdateDate: new Date(),
    Active: false
  };

  constructor(
    public bs: BackendService,
    public alert: AlertService,
    public popup: PopupService,
    private spinner: NgxSpinnerService,
    public dataService: DataService
  ) { }

  ngOnInit(): void {
    this.getVarieties('');
    this.getSystemConfig('Grade');
  }

  async getVarieties(Name: string) {
    this.bs.post('get_varieties.php', { Name: Name }).then((d: any) => {
      if (d.Return.Varieties != 0) {
        this.varietiesList = d.Return.Varieties;

      }
    });
  }

  varieties1Change() {
    this.varieties1 = this.varietiesList.find((d) => d.VarietiesID == this.varietiesID1) || {
      VarietiesID: 0,
      UpdateBy: 0,
      UpdateDate: new Date(),
      Active: false
    };

    this.getStringGradePrice(this.varietiesID1).then((d) => {
      this.gradePrice1 = d;
    });
  }
  varieties2Change() {
    this.varieties2 = this.varietiesList.find((d) => d.VarietiesID == this.varietiesID2) || {
      VarietiesID: 0,
      UpdateBy: 0,
      UpdateDate: new Date(),
      Active: false
    };

    this.getStringGradePrice(this.varietiesID2).then((d) => {
      this.gradePrice2 = d;
    });
  }

  async getSystemConfig(ConfigCode: string) {
    await this.bs.sc(ConfigCode).then((d: any) => {
      if (d.Return.SystemConfig != 0) {
        this.systemConfigList = d.Return.SystemConfig;
      }
    });
  }

  getGradeDisplay(gradeCode: string | undefined) {
    return this.systemConfigList.find((d) => d.ConfigValue == gradeCode)
      ?.ConfigDisplay;
  }

  async getStringGradePrice(varietiesID: number) {

    let stringGradePrice = '';
    await this.bs
      .post('get_prive.php', {
        VarietiesID: varietiesID,
        GradeCode: '',
      })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.Price != 0) {
          this.priceList = d.Return.Price;
        } else {
          this.priceList = [];
        }

        console.log(this.priceList);

      });

    if (this.priceList) {
      this.priceList.forEach((d, index) => {
        let gradeName = ''
        gradeName = this.getGradeDisplay(d.GradeCode) || '';
        stringGradePrice += 'เกรด ' + gradeName + ' : ' + d.SellingPrice?.toString() + ' บาท' + ((index == this.priceList.length - 1) ? '' : '\n').toString();
      });
      return stringGradePrice;
    }
    return '';
  }

  private popupRef: any;
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
  
  public GradeOfVarietiesList: Array<SystemConfig> = [];
  public gradeCode:string ='';
  public gradeName:string ='';
  public amount:number = 0 ;
  async openVarietiesDetail(content: TemplateRef<any>, varieties: Varieties) {
    this.popupRef = this.popup.open(content);
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

  public price: number = 0;
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

  public totalPrice: number = 0;
  calculatePrice() {
    this.totalPrice = this.price * this.amount;
  }

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

    this.popupRef?.close();

    this.alert.succ('เพิ่มทุเรียนในตะกร้าแล้ว');
  }
}
