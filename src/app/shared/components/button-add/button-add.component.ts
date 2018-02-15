import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sacpi-button-add',
  templateUrl: './button-add.component.html',
  styleUrls: ['./button-add.component.scss']
})
export class ButtonAddComponent implements OnInit {

  @Input()
  sacpiForm: FormGroup;

  @Input()
  working = false;

  @Output()
  sacpiOnSave: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  save() {
    if (!this.sacpiForm.valid) {
      this.sacpiOnSave.emit(true);
    } else {
      this.sacpiOnSave.emit(false);
    }
  }

}
