import { GenericType } from './../../../../../core/model/genericType.model';
import { DataService } from './../../../../../core/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, NgModule, OnInit } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import { ActionConfig } from 'patternfly-ng/action';
import { ToolbarConfig } from 'patternfly-ng/toolbar';

@Component({
  selector: 'sacpi-requirement-view',
  templateUrl: './requirement-view.component.html',
  styleUrls: ['./requirement-view.component.scss']
})
export class RequirementViewComponent implements OnInit {

  toolbarConfig: ToolbarConfig;

  loading = false;

  routingSub: Subscription;
  requirement: Observable<any>;

  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private dataService: DataService) {
  }
  ngAfterViewInit() {

  }

  ngOnInit() {
    this.initToolbar();
    this.loading = true;
    this.routingSub = this.route.params.subscribe(params => {
      let id = +params['id'];
      this.dataService.requeriments().viewById(id).subscribe((data: any) => {
        this.requirement = data;
        this.loading = false;
      },
        (error) => {
          this.loading = false;
        });
    });
  }

  ngOnDestroy(): void {
    this.routingSub.unsubscribe();
  }

  initToolbar() {
    this.toolbarConfig = {
      views: [{
        id: 'listView',
        iconStyleClass: 'fa fa-th-list',
        tooltip: 'List View'
      }, {
        id: 'tableView',
        iconStyleClass: 'fa fa-table',
        tooltip: 'Table View'
      }]
    } as ToolbarConfig;
  }

  editar(requirement: any) {
    this.router.navigate(['../../', requirement.IdRequirement], { relativeTo: this.route });
  }
  confirmar(requirement: any) {
    let iduser: any = this.dataService.users().getUserId();
    this.loading = true;
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('idRequeriment', requirement.IdRequirement);
    queryParams.set('idUser', iduser);
    this.dataService.requeriments().confirmar(queryParams).subscribe(
      response => {
        this.loading = false;
        this.router.navigate(['../../'], { relativeTo: this.route });
      },
      error => {
        this.loading = false;
      }
    );
  }
  eliminar(requirement: any) {
    let id = requirement.IdRequirement;
    let iduser: any = this.dataService.users().getUserId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('idUser', iduser);
    this.dataService.requeriments().delete(id, queryParams).subscribe((data) => {
      this.router.navigate(['../../'], { relativeTo: this.route });
    });
  }

  cancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
