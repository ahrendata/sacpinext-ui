import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
//import { ToastsManager } from 'ng2-toastr';

import { DataService } from '../../../core/data/data.service';
import { User } from '../../../core/model/user.model';

@Component({
  selector: 'sacpi-sing-in',
  templateUrl: './sing-in.component.html',
  styleUrls: ['./sing-in.component.scss']
})
export class SingInComponent implements OnInit {

  form: FormGroup;
  working = false;
  loading = false;
  user: User;
  returnUrl: string;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
   // private toastr: ToastsManager,
    vcr: ViewContainerRef) { //this.toastr.setRootViewContainerRef(vcr);
     }

  ngOnInit() {
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    if (this.dataService.users().findToken()) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.dataService.users().logout();
      this.buildForm();
    }
  }

  buildForm() {
    this.form = this.formBuilder.group({
      UserName: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      Password: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
    });
  }
  login(form: FormGroup): void {
    this.loading = true;
    this.working = true;
    const userCopy = Object.assign(this.user || {}, form.value);
    this.dataService.users().search(userCopy).subscribe(
      result => {
      //  this.toastr.success('Ingresando al sistema...', 'Login');
        this.router.navigate([this.returnUrl]);
      },
      error => {
      //  this.toastr.error('Usuario y/o Contraseña incorrecta', 'Login');
        this.loading = false;
        this.working = false;
      },
      () => {
        this.loading = false;
        this.working = false;
      }
    );
  }
}
