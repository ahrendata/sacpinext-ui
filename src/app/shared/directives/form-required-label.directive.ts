import { AbstractControl, FormControl, Validators } from '@angular/forms';
import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';

@Directive({
  selector: '[sacpiFormRequiredLabel]'
})
export class FormRequiredLabelDirective implements OnInit {

  @Input()
  sacpiFormRequiredLabel: FormControl;

  @HostBinding('class.required-pf')
  isRequired: boolean;

  constructor() { }

  ngOnInit() {
    const validator: any = this.sacpiFormRequiredLabel.validator && this.sacpiFormRequiredLabel.validator(new FormControl());
    this.isRequired = validator && validator.required;
  }

}
