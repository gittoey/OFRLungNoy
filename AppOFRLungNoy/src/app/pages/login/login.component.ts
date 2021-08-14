import { Component, OnInit, OnDestroy, Input,enableProdMode} from '@angular/core';
import { Login, Register } from 'src/app/model/auth.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  @Input() login : Login={User:"",Pass:""};
  @Input() register : Register={Name:"",User:"",Pass1:"",Pass2:""};

  constructor(
    private alert:AlertService,
    private api:BackendService,
  ) {}

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  loginClick(){
    let msg : string = "";
    if(this.login.User == ""){
      msg += "กรอก : อีเมล์ หรือ โทรศัพท์";
    }
    if(this.login.Pass == ""){
      if(msg != ""){
        msg += "\n"
      }
      msg += "กรอก : รหัสผ่าน";
    }

    if(msg != ""){
      this.alert.err(msg);''
      return;
    }
    
    this.api.post("test.php",this.login).then((data) => {
      console.log(data);
    }).catch(() => {

    });
  }

  registerClick(){
    let msg : string = "";
    if(this.register.Name == ""){
      msg += "กรอก : ชื่อ";
    }
    if(this.register.User == ""){
      if(msg != ""){
        msg += "\n"
      }
      msg += "กรอก : อีเมล์ หรือ โทรศัพท์";
    }
    if(this.register.Pass1 == ""){
      if(msg != ""){
        msg += "\n"
      }
      msg += "กรอก : รหัสผ่าน";
    }
    if(this.register.Pass2 == ""){
      if(msg != ""){
        msg += "\n"
      }
      msg += "กรอก : ยืนยันรหัสผ่าน";
    }

    if(msg != ""){
      this.alert.err(msg);
    }
  }

}
