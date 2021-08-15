import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AlertService {

  constructor() { 
  }

  err(msg:string){
    Swal.fire({
      title: 'เกิดข้อผิดพลาด!',
      html: "<div style='display: table; text-align: left; margin: auto;'>"+msg.replace(/\n/g, '<br/>')+"</div>",
      icon: 'error',
      confirmButtonText: 'ตกลง',
      allowEnterKey: true,
      allowOutsideClick:false
    })
  }

  succ(msg:string){
    Swal.fire({
      title: 'สำเร็จ',
      html: "<div style='display: table; text-align: left; margin: auto;'>"+msg.replace(/\n/g, '<br/>')+"</div>",
      icon: 'success',
      confirmButtonText: 'ตกลง',
      allowEnterKey: true,
      allowOutsideClick:false
    })
  }
}
