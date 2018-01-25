import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'sacpi-form-fields-status',
  templateUrl: './form-fields-status.component.html',
  styleUrls: ['./form-fields-status.component.scss']
})
export class FormFieldsStatusComponent implements OnInit {

  @Input()
  sacpiForm: FormGroup;

  hasRequiredFields: boolean;

  constructor() { }

  ngOnInit() {
    this.refreshState();
  }

  refreshState() {
    this.hasRequiredFields = this.checkIfHasRequiredFields(this.sacpiForm);
  }

  checkIfHasRequiredFields(formGroup: FormGroup): boolean {
    let result = false;
    for (const key in this.sacpiForm.controls) {
      if (!this.sacpiForm.controls[key]) { continue; }

      const abstractControl: AbstractControl = this.sacpiForm.controls[key];
      if (abstractControl instanceof FormGroup) {
        if (this.checkIfHasRequiredFields(abstractControl)) {
          result = true;
          break;
        }
      } else {
        const validator: any = abstractControl.validator && abstractControl.validator(new FormControl());
        if (validator && validator.required) {
          result = true;
          break;
        }
      }
    }
    return result;
  }

}
