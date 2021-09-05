import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgxSpinnerService } from 'ngx-spinner';
import { Price, SystemConfig, Varieties } from 'src/app/model/db.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';
import { environment } from 'src/environments/environment';
import { PopupService } from 'src/app/service/popup.service';

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
  public price: number = 0;
  public amount: number = 0;
  public totalPrice: number = 0;

  constructor(
    public bs: BackendService,
    public alert: AlertService,
    private spinner: NgxSpinnerService,
    public popup: PopupService
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
        this.gradeCode =
          this.GradeOfVarietiesList[0].ConfigValue == undefined
            ? ''
            : this.GradeOfVarietiesList[0].ConfigValue;

        this.gradeOnChange();
      });
  }

  gradeOnChange() {
    this.spinner.show();
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
    this.popup.ref?.close();
  }
}
