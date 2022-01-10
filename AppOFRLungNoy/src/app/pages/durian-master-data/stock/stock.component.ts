import { Component, Input, OnInit } from '@angular/core';
import { Varieties, SystemConfig, Price } from 'src/app/model/db.model';
import { BackendService } from 'src/app/service/backend.service';
import { AlertService } from 'src/app/service/alert.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-stock',
  templateUrl: './stock.component.html',
  styleUrls: ['./stock.component.scss']
})
export class StockComponent implements OnInit {
  public varietiesList: Array<Varieties> = [];
  public systemConfigList: Array<SystemConfig> = [];
  public priceList: Array<Price> = [];

  @Input() price: Price = {
    PriceID: 0,
    VarietiesID: 0,
    GradeCode: '',
    CostPrice: undefined,
    SellingPrice: undefined,
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: true,
    Stock: 0
  };

  public isEdit: boolean = false;

  constructor(
    public bs: BackendService,
    public alert: AlertService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    await this.getVarieties('');
    await this.getSystemConfig('Grade');
    await this.getPrice(0, '');
  }

  async getVarieties(Name: string) {
    this.bs.post('get_varieties.php', { Name: Name }).then((d: any) => {
      if (d.Return.Varieties != 0) {
        this.varietiesList = d.Return.Varieties;
      }
    });
  }

  async varietiesChange(): Promise<void> {
    this.spinner.show();
    await this.getPrice(this.price.VarietiesID, this.price.GradeCode ?? '');
  }

  async getSystemConfig(ConfigCode: string) {
    await this.bs.sc(ConfigCode).then((d: any) => {
      if (d.Return.SystemConfig != 0) {
        this.systemConfigList = d.Return.SystemConfig;
      }
    });
  }

  async save() {
    let errText = '';
    if (this.price.VarietiesID == 0) {
      errText = 'เลือก : พันธุ์ทุเรียน';
    }

    if (this.price.GradeCode == '') {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'เลือก : เกรดทุเรียน';
    }

    if (this.price.CostPrice == undefined || this.price.CostPrice == 0) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : ราคาต้นทุน มากกว่า 0';
    }

    if (this.price.SellingPrice == undefined || this.price.SellingPrice == 0) {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : ราคาขาย มากกว่า 0';
    }

    if (errText != '') {
      this.alert.err(errText);
      return;
    }

    let ckPrice = '';
    this.spinner.show();
    await this.bs
      .post('get_prive.php', {
        VarietiesID: this.price.VarietiesID,
        GradeCode: this.price.GradeCode,
      })
      .then((d: any) => {
        if (d.Return.Price.length > 0 || d.Return.Price != 0) {
          ckPrice =
            'พันธุ์ทุเรียน : ' +
            this.getVarietiesName(this.price.VarietiesID) +
            '\nเกรด : ' +
            this.getGradeDisplay(this.price.GradeCode) +
            '\nแจ้ง : มีการตั้งราคาแล้ว';
        }
      });

    if (ckPrice != '' && !this.isEdit) {
      this.alert.err(ckPrice);
      this.spinner.hide();
      return;
    }

    var Insert = {
      Table: 'Price',
      Data: this.price,
    };

    await this.bs.cu(Insert).then((d: any) => {
      if (d.Return.Status == 'Yes') {
        var msg = '';
        if (this.isEdit) {
          msg = 'แก้ไขราคาธุ์ทุเรียน สำเร็จ';
        } else {
          msg = 'เพิ่มราคาธุ์ทุเรียน สำเร็จ';
        }
        this.alert.succ(msg);

        this.price = {
          PriceID: 0,
          VarietiesID: this.price.VarietiesID,
          GradeCode: '',
          CostPrice: undefined,
          SellingPrice: undefined,
          CreateBy: 0,
          UpdateBy: 0,
          CreateDate: new Date(),
          UpdateDate: new Date(),
          Active: false,
          Stock: 0,
        };

        this.getPrice(this.price.VarietiesID, '');
        this.isEdit = false;
      } else {
        this.alert.err(d.Return.Message);
      }
    });
    this.spinner.hide();
  }

  async getPrice(VarietiesID: number, GradeCode: string) {
    this.bs
      .post('get_prive.php', { VarietiesID: VarietiesID, GradeCode: GradeCode })
      .then((d: any) => {
        this.spinner.hide();
        if (d.Return.Price != 0) {
          this.priceList = d.Return.Price;
        } else {
          this.priceList = [];
        }
      });
  }

  getVarietiesName(varietiesID: number) {
    return this.varietiesList.find((d) => d.VarietiesID == varietiesID)?.Name;
  }

  getGradeDisplay(gradeCode: string | undefined) {
    return this.systemConfigList.find((d) => d.ConfigValue == gradeCode)
      ?.ConfigDisplay;
  }

  edit(Price: Price) {
    this.isEdit = true;
    this.price = Price;
  }

  delete(PriceID: number) {
    this.alert.conf('ยืนยันการลบ ใช่หรือไม่').then(async (result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.price = {
          PriceID: PriceID,
          VarietiesID: this.price.VarietiesID,
          GradeCode: '',
          CostPrice: undefined,
          SellingPrice: undefined,
          CreateBy: 0,
          UpdateBy: 0,
          CreateDate: new Date(),
          UpdateDate: new Date(),
          Active: false,
          Stock: 0,
        };

        var Update = {
          Table: 'Price',
          Data: this.price,
        };

        await this.bs.cu(Update).then((d: any) => {
          this.spinner.hide();
          this.alert.succ('ลบราคาทุเรียน สำเร็จ');
          this.getPrice(this.price.VarietiesID, '');
        });
      }
    });
  }

  cancel() {
    this.alert.conf('ยืนยันการยกเลิก ใช่หรือไม่').then((result) => {
      if (result.isConfirmed) {
        this.price = {
          PriceID: 0,
          VarietiesID: 0,
          GradeCode: '',
          CostPrice: undefined,
          SellingPrice: undefined,
          CreateBy: 0,
          UpdateBy: 0,
          CreateDate: new Date(),
          UpdateDate: new Date(),
          Active: false,
          Stock: 0,
        };
        this.isEdit = false;
        this.getPrice(this.price.VarietiesID, '');
      }
    });
  }
}
