import { Component, Input, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

@Component({
  selector: 'sacpi-form-field-validation-messages',
  templateUrl: './form-field-validation-messages.component.html',
  styleUrls: ['./form-field-validation-messages.component.scss']
})
export class FormFieldValidationMessagesComponent implements OnInit {
  @Input()
  sacpiFormControl: FormControl;

  constructor() { }

  ngOnInit() {
  }

}
