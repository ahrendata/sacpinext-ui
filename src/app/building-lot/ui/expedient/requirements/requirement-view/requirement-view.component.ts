import { GenericType } from './../../../../../core/model/genericType.model';
import { DataService } from './../../../../../core/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, NgModule, OnInit, ViewContainerRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import { ActionConfig } from 'patternfly-ng/action';
import { ToolbarConfig } from 'patternfly-ng/toolbar';
import { ToastsManager } from 'ng2-toastr/src/toast-manager';

@Component({
  selector: 'sacpi-requirement-view',
  templateUrl: './requirement-view.component.html',
  styleUrls: ['./requirement-view.component.scss']
})
export class RequirementViewComponent implements OnInit {

  toolbarConfig: ToolbarConfig;

  loading = false;

  routingSub: Subscription;
  requirement: any;
  codigo: string;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notification: ToastsManager,
    private viewContainerRef: ViewContainerRef) {
    this.notification.setRootViewContainerRef(viewContainerRef);
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
        this.codigo = this.requirement.CodRequirement;
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

  editar() {
    this.router.navigate(['../../', this.requirement.IdRequirement], { relativeTo: this.route });
  }
  confirmar() {
    let iduser: any = this.dataService.users().getUserId();
    this.loading = true;
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('idRequeriment', this.requirement.IdRequirement);
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

  eliminar(selected: boolean) {
    if (selected) {
      let id = this.requirement.IdRequirement;
      let iduser: any = this.dataService.users().getUserId();
      const queryParams: URLSearchParams = new URLSearchParams();
      queryParams.set('idUser', iduser);
      this.dataService.requeriments().delete(id, queryParams).subscribe((data) => {
        this.notification.success('El requerimiento fue eliminado correctamente.', 'Informacion');
        this.router.navigate(['../../'], { relativeTo: this.route });
      },
    (error)=>{
      this.notification.error('Error al eliminar el requerimiento, por favor intente de nuevo.', 'Error');
    });
    } 
  }

  imprimir(requirement: any) {

  }
  cancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
  }
}
