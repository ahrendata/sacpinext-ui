import { BsModalRef } from 'ngx-bootstrap/modal';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs/Subject';

@Component({
  selector: 'sacpi-confirmation-modal',
  templateUrl: './confirmation-modal.component.html',
  styleUrls: ['./confirmation-modal.component.scss']  
})
export class ConfirmationModalComponent implements OnInit {

  public active: boolean = false;
  public body: string;
  public data: string;
  public onClose: Subject<boolean>;

  public constructor(
    private _bsModalRef: BsModalRef
  ) { }

  public ngOnInit(): void {
    this.onClose = new Subject();
  }

  public showConfirmationModal(body: string, data: string): void {
    this.body = body;
    this.data = data;
    this.active = true;
  }

  public onConfirm(): void {
    this.active = false;
    this.onClose.next(true);
    this._bsModalRef.hide();
  }

  public onCancel(): void {
    this.active = false;
    this.onClose.next(false);
    this._bsModalRef.hide();
  }

  public hideConfirmationModal(): void {
    this.active = false;
    this.onClose.next(null);
    this._bsModalRef.hide();
  }
}
