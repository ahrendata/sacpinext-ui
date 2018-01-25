import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sacpi-button-reset',
  templateUrl: './button-reset.component.html',
  styleUrls: ['./button-reset.component.scss']
})
export class ButtonResetComponent implements OnInit {

  @Input()
  sacpiForm: FormGroup;

  @Output()
  sacpiOnReset: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  reset() {
    this.sacpiForm.reset();
    this.sacpiOnReset.emit(true);
  }

}
