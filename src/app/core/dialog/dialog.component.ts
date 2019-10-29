import { Component, Input, OnInit, Output, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
@Component({
  selector: 'sacpi-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {

  @ViewChild("modal", {static: false}) templateModal: TemplateRef<any>;

  @Input() title: string;
  @Input() message: string;
  @Input() action: string;
  @Input() data: string;

  @Output() onAction: EventEmitter<boolean> = new EventEmitter();

  modalRef: BsModalRef;

  constructor(private modalService: BsModalService) { }

  ngOnInit() {
  }

  openModal() {
    this.modalRef = this.modalService.show(this.templateModal, { keyboard: false, backdrop: 'static' });
  }

  aceptar() {
    this.modalRef.hide();
    this.onAction.emit(true);
  }

  eliminar() {
    this.modalRef.hide();
    this.onAction.emit(true);
  }
  cancelar() {
    this.modalRef.hide();
    this.onAction.emit(false);
  }
}
