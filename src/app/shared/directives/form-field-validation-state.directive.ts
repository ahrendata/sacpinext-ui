import { Directive, HostBinding, Input, OnInit } from '@angular/core';

import { FormControl } from '@angular/forms';

@Directive({
  selector: '[sacpiFormFieldValidationState]'
})
export class FormFieldValidationStateDirective implements OnInit {

  @Input()
  sacpiFormFieldValidationState: FormControl;

  @HostBinding('class.has-error')
  hasError: boolean;

  constructor() { }

  ngOnInit() {
    this.sacpiFormFieldValidationState.statusChanges.subscribe(controlValue => {
      if (this.sacpiFormFieldValidationState.valid || this.sacpiFormFieldValidationState.disabled) {
        this.hasError = false;
      } else {
        this.hasError = true;
      }
    });
  }

}
