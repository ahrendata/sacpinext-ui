import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sacpi-button-cancel',
  templateUrl: './button-cancel.component.html',
  styleUrls: ['./button-cancel.component.scss']
})
export class ButtonCancelComponent implements OnInit {

  @Output()
  sacpiOnCancel: EventEmitter<boolean> = new EventEmitter<boolean>();
  
  constructor() { }

  ngOnInit() {
  }
  
  cancel() {
    this.sacpiOnCancel.emit(true);
  }
}
