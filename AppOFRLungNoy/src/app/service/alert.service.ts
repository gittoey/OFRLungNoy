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

  conf(msg:string){
    return Swal.fire({
      title: 'ยืนยัน?',
      html: "<div style='display: table; text-align: left; margin: auto;'>"+msg.replace(/\n/g, '<br/>')+"</div>",
      icon: 'info',
      showCancelButton: true,
      cancelButtonText:"ไม่",
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'ใช่',      
      allowEnterKey: true,
      allowOutsideClick:false
    });
  }  

  warn(msg:string){
    Swal.fire({
      title: 'แจ้ง!',
      html: "<div style='display: table; text-align: left; margin: auto;'>"+msg.replace(/\n/g, '<br/>')+"</div>",
      icon: 'warning',
      confirmButtonText: 'ตกลง',
      allowEnterKey: true,
      allowOutsideClick:false
    })
  }
}
