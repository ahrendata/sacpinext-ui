import { Component, Input, OnInit } from '@angular/core';

import { FormGroup } from '@angular/forms';

@Component({
  selector: 'sacpi-button-confirmar',
  templateUrl: './button-confirmar.component.html',
  styleUrls: ['./button-confirmar.component.scss']
})
export class ButtonConfirmarComponent implements OnInit {

  @Input()
  sacpiForm: FormGroup;

  @Input()
  working = false;

  constructor() { }

  ngOnInit() {
  }

  onClickChild(event) {
    if (!this.sacpiForm.valid) {
      event.preventDefault();
    }
  }
}
