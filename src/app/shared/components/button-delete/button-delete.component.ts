import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';

import { Model } from '../../../core/model/model';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { ModalDirective } from 'ngx-bootstrap';

@Component({
  selector: 'sacpi-button-delete',
  templateUrl: './button-delete.component.html',
  styleUrls: ['./button-delete.component.scss']
})
export class ButtonDeleteComponent implements OnInit {

  @ViewChild('deleteModal', {static: false})
  private modal: ModalDirective;

  // Object to be deleted
  @Input()
  model: Model;

  // Resource Kind to delete (e.g., 'Pod' or 'ReplicationController').
  @Input()
  kind: string;

  // Optional display name for kind.
  @Input()
  typeDisplayName: string;

  // Optional display name of the resource to delete.
  @Input()
  displayName: string;

  // Name of the resource to delete.
  @Input()
  resourceName: string;

  // Set to true to disable the delete button.
  @Input()
  disableDelete = false;

  // Force the user to enter the name before we'll delete the resource (e.g. for projects).
  @Input()
  typeNameToConfirm = false;

  // Optional link label. Defaults to 'Delete'.
  @Input()
  label: string;

  // Only show a delete icon with no text.
  @Input()
  buttonOnly: boolean;

  // Stay on the current page without redirecting to the resource list.
  @Input()
  stayOnCurrentPage = true;

  // Optional callback when the delete succeeds
  @Output()
  onConfirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  // Optional redirect URL when the delete succeeds
  @Input()
  redirectUrl: string;

  confirmName = '';

  constructor(private router: Router//,              private modalService: NgbModal
  ) {
  }

  ngOnInit() {
  }

  isExpedient(): boolean {
    if (this.kind === 'Expedient') {
      return true;
    }
    return false;
  }

  delete(): void {
    if (this.disableDelete) {
      return;
    }
    this.modal.hide();
    this.onConfirm.emit(true);
  }


}
