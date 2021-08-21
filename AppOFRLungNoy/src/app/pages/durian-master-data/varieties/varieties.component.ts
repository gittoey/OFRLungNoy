import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { Varieties } from 'src/app/model/db.model';
import { BackendService } from 'src/app/service/backend.service';
import { AlertService } from 'src/app/service/alert.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-varieties',
  templateUrl: './varieties.component.html',
  styleUrls: ['./varieties.component.scss'],
})
export class VarietiesComponent implements OnInit {
  @Input() varieties: Varieties = {
    VarietiesID: 0,
    VarietiesName: '',
    VarietiesImg: '',
    VarietiesDecs: '',
    CreateBy: 0,
    UpdateBy: 0,
    CreateDate: new Date(),
    UpdateDate: new Date(),
    Active: true,
  };

  public api = environment.apiHost;
  public searchVarietiesName: string = '';
  public varietiesList: Array<Varieties> = [];
  public isEdit: boolean = false;

  @ViewChild('takeInput', { static: false })
  InputVar: ElementRef = {
    nativeElement: null,
  };
  public from: FormData = new FormData();

  constructor(public bs: BackendService, public alert: AlertService) {}

  async ngOnInit(): Promise<void> {
    await this.getVarieties('');
  }

  setFromFile(event: any) {
    this.bs.setFormDataFile(this.from, 'File', event);
    this.from.append('Path', 'VarietiesImg/');
  }

  async getVarieties(VarietiesName: string) {
    this.bs
      .post('get_varieties.php', { VarietiesName: VarietiesName })
      .then((d: any) => {
        console.log(d);
        if (d.Return.Varieties != 0) {
          this.varietiesList = d.Return.Varieties;
        }
        console.log(this.varietiesList);
      });
  }

  async save() {
    let errText = '';
    if (this.varieties.VarietiesName == '') {
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

    if (this.varieties.VarietiesDecs == '') {
      if (errText != '') {
        errText += '\n';
      }
      errText += 'กรอก : คำอธิบาย';
    }

    if (errText != '') {
      this.alert.err(errText);
      return;
    }

    let PathFile: string = '';
    await this.bs.uploadFile('upload_file.php', this.from).then((d: any) => {
      PathFile = d.PathFileName;
    });

    if (this.from.get('File')) {
      this.varieties.VarietiesImg = PathFile.toString();
    }

    var Insert = {
      Table: 'Varieties',
      Data: this.varieties,
    };

    this.bs.cu(Insert).then((d: any) => {
      if (d.Return.Status == 'Yes') {
        this.varieties = {
          VarietiesID: 0,
          VarietiesName: '',
          VarietiesImg: '',
          VarietiesDecs: '',
          CreateBy: 0,
          UpdateBy: 0,
          CreateDate: new Date(),
          UpdateDate: new Date(),
          Active: true,
        };
        this.from.delete('File');
        this.InputVar.nativeElement.value = '';
        this.alert.succ('เพิ่มพันธุ์ทุเรียน สำเร็จ');
        this.getVarieties('');
        this.isEdit = false;
      } else {
        this.alert.err(d.Return.Message);
      }
    });
  }

  search() {
    this.getVarieties(this.searchVarietiesName);
  }

  delete(varietiesID: number) {
    this.alert.conf('ยืนยันการลบ ใช่หรือไม่').then((result) => {
      if (result.isConfirmed) {
        this.varieties = {
          VarietiesID: varietiesID,
          VarietiesName: undefined,
          VarietiesImg: undefined,
          VarietiesDecs: undefined,
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
          console.log(d);
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
          VarietiesName: '',
          VarietiesImg: '',
          VarietiesDecs: '',
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
