import { Injectable, TemplateRef } from '@angular/core';
import { NgbModalConfig, NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';

@Injectable({
  providedIn: 'root'
})
export class PopupService {
  public ref: NgbModalRef | undefined;

  constructor(config: NgbModalConfig, private modalService: NgbModal ) {
    config.backdrop = 'static';
    config.centered = true;
  }

  open(content:TemplateRef<any>){
    this.ref = this.modalService.open(content);
  }

  open_lg(content:TemplateRef<any>){
    this.ref = this.modalService.open(content, { size: 'lg' });
  }

  open_xl(content:TemplateRef<any>){
    this.ref = this.modalService.open(content, { size: 'xl' });
  }
}
