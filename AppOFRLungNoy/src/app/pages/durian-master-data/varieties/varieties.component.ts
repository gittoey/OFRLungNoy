import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Varieties } from 'src/app/model/db.model';
import { BackendService } from 'src/app/service/backend.service';
import { AlertService } from 'src/app/service/alert.service';
import { environment } from 'src/environments/environment';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-varieties',
  templateUrl: './varieties.component.html',
  styleUrls: ['./varieties.component.scss'],
})
export class VarietiesComponent implements OnInit {
  @Input() varieties: Varieties = {
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

  public api = environment.apiHost;
  public searchName: string = '';
  public varietiesList: Array<Varieties> = [];
  public isEdit: boolean = false;

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef = {
    nativeElement: null,
  };
  public from: FormData = new FormData();

  constructor(
    public bs: BackendService,
    public alert: AlertService,
    private spinner: NgxSpinnerService
  ) {}

  async ngOnInit(): Promise<void> {
    this.spinner.show();
    await this.getVarieties('');
  }

  setFromFile(event: any) {
    this.bs.setFormDataFile(this.from, 'File', event);
    this.from.append('Path', 'VarietiesImg/');
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

  async save() {
    let errText = '';
    if (this.varieties.Name == '') {
      errText = 'กรอก : ชื่อพันธุ์ทุเรียน';
    }

    if (!this.from.get('File')) {
      if (this.varieties.VarietiesID == 0) {
        if (errText != '') {
          errText += '\n';
        }
        errText += 'เลือก : รูปพันธุ์ทุเรียน';
      }
    }

    if (this.varieties.Meat == '') {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : เนื้อ';
    }

    if (this.varieties.Smell == '') {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : กลิ่น';
    }

    if (this.varieties.Flavor == '') {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : รสชาติ';
    }

    if (this.varieties.DeliciousTerm == '') {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : ระยะอร่อย';
    }

    if (this.varieties.Decs == '') {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : คำอธิบาย';
    }

    if (errText != '') {
      this.alert.err(errText);
      return;
    }
    this.spinner.show();

    let PathFile: string = '';
    if(this.InputVar.nativeElement.value != ""){
      await this.bs.uploadFile(this.from).then((d: any) => {
        PathFile = d.PathFileName;
      });
    }

    if (this.from.get('File')) {
      this.varieties.Img = PathFile.toString();
    }

    var Conn = {
      Table: 'Varieties',
      Data: this.varieties,
    };

    this.bs.cu(Conn).then((d: any) => {
      this.spinner.hide();
      if (d.Return.Status == 'Yes') {
        this.varieties = {
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
        this.from.delete('File');
        this.InputVar.nativeElement.value = '';

        var msg = '';
        if (this.isEdit) {
          msg = 'แก้ไขพันธุ์ทุเรียน สำเร็จ';
        } else {
          msg = 'เพิ่มพันธุ์ทุเรียน สำเร็จ';
        }
        this.alert.succ(msg);
        this.getVarieties('');
        this.isEdit = false;
      } else {
        this.alert.err(d.Return.Message);
      }
    });
  }

  search() {
    this.spinner.show();
    this.getVarieties(this.searchName);
  }

  delete(varietiesID: number) {
    this.alert.conf('ยืนยันการลบ ใช่หรือไม่').then((result) => {
      if (result.isConfirmed) {
        this.spinner.show();
        this.varieties = {
          VarietiesID: varietiesID,
          Name: undefined,
          Img: undefined,
          Meat: undefined,
          Smell: undefined,
          Flavor: undefined,
          DeliciousTerm: undefined,
          Decs: undefined,
          CreateBy: undefined,
          UpdateBy: 0,
          CreateDate: undefined,
          UpdateDate: new Date(),
          Active: false,
        };

        var Update = {
          Table: 'Varieties',
          Data: this.varieties,
        };

        this.bs.cu(Update).then((d: any) => {
          this.spinner.hide();
          this.alert.succ('ลบพันธุ์ทุเรียน สำเร็จ');
          this.getVarieties('');
        });
      }
    });
  }

  edit(Varieties: Varieties) {
    this.isEdit = true;
    this.varieties = Varieties;
    this.alert.warn('ไม่เลือกรูป = ไม่แก้รูป');
  }

  cancel() {
    this.alert.conf('ยืนยันการยกเลิก ใช่หรือไม่').then((result) => {
      if (result.isConfirmed) {
        this.varieties = {
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
        this.from.delete('File');
        this.InputVar.nativeElement.value = '';
        this.isEdit = false;
      }
    });
  }
}
