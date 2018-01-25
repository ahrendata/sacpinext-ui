import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Validators, FormGroup } from '@angular/forms';
import { FormBuilder, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng2-toastr';

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
  user: User;
  returnUrl: string;

  constructor(private router: Router,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    this.dataService.users().logout();
    this.returnUrl = this.activatedRoute.snapshot.queryParams['returnUrl'] || '/';
    this.buildForm();
  }

  buildForm() {
    this.form = this.formBuilder.group({
      UserName: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
      Password: [null, Validators.compose([Validators.required, Validators.maxLength(100)])],
    });
  }
  login(form: FormGroup): void {
    this.working = true;
    const userCopy = Object.assign(this.user || {}, form.value);
    console.log(userCopy);
    
    this.dataService.users().search(userCopy).subscribe(
      result => {
        this.toastr.success('Success! login.');
        //this.router.navigate(['../']);
        this.router.navigate([this.returnUrl]);
      },
      () => {
        this.working = false;
      }
    );
  }
}
