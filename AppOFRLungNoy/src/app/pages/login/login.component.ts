import { Component, OnInit, OnDestroy, Input,enableProdMode} from '@angular/core';
import { Router } from '@angular/router';
import { Login, Register } from 'src/app/model/auth.model';
import { AlertService } from 'src/app/service/alert.service';
import { BackendService } from 'src/app/service/backend.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  
  @Input() login : Login={Username:"",Password:""};
  @Input() register : Register={Name:"",Username:"",Password1:"",Password2:""};

  constructor(
    private alert:AlertService,
    private api:BackendService,
    private router:Router
  ) {}

  ngOnInit() {
  }
  ngOnDestroy() {
  }

  loginClick(){
    let msg : string = "";
    if(this.login.Username == ""){
      msg += "กรอก : อีเมล์ หรือ โทรศัพท์";
    }
    if(this.login.Password == ""){
      if(msg != ""){
        msg += "\n"
      }
      msg += "กรอก : รหัสผ่าน";
    }

    if(msg != ""){
      this.alert.err(msg);
      return;
    }
    
    this.api.post("login.php",this.login).then((data:any) => {
      console.log(data);
      if(data.Return.Status == "Error"){
        this.alert.err(data.Return.Message);
        return;
      }
      if(data.Return.Status == "No"){
        let Message = "";
        if(data.Return.Type == "Username"){
          Message = "ไม่พบ อีเมล์ หรือ โทรศัพท์ อยู่ในระบบ";
        }

        if(data.Return.Type == "Password"){
          Message = "รหัสผ่าน ไม่ถูกต้อง";
        }
        
        this.alert.err(Message);
        return;
      }

      this.router.navigate(['/dashboard']);
    }).catch((err) => {
      this.alert.err(err);
    });
  }

  registerClick(){
    let msg : string = "";
    if(this.register.Name == ""){
      msg += "กรอก : ชื่อ";
    }
    if(this.register.Username == ""){
      if(msg != ""){
        msg += "\n"
      }
      msg += "กรอก : อีเมล์ หรือ โทรศัพท์";
    }
    if(this.register.Password1 == ""){
      if(msg != ""){
        msg += "\n"
      }
      msg += "กรอก : รหัสผ่าน";
    }
    if(this.register.Password2 == ""){
      if(msg != ""){
        msg += "\n"
      }
      msg += "กรอก : ยืนยันรหัสผ่าน";
    }
    if(this.register.Password1 != this.register.Password2){
      if(msg != ""){
        msg += "\n"
      }
      msg += "ยืนยันรหัสผ่านไม่ตรงกัน";
    }

    if(msg != ""){
      this.alert.err(msg);
      return;
    }

    this.api.post("register.php",this.register).then((data:any) => {
      console.log(data);
      if(data.Return.Status == "Error"){
        this.alert.err(data.Return.Message);
        return;
      }
      if(data.Return.Status == "No"){
        let Message = "";
        if(data.Return.Type == "Username"){
          Message = "มี "+this.register.Username+" อยู่ในระบบแล้ว";
        }
        
        this.alert.err(Message);
        return;
      }

      this.alert.succ("สมัคสมาชิกด้วย '"+this.register.Username+"' สำเร็จ");
      this.register = {Name:"",Username:"",Password1:"",Password2:""};

    }).catch((err) => {
      this.alert.err(err);
      return;
    });
    
  }

}
