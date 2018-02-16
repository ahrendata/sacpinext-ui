import { GenericType } from './../../../../../core/model/genericType.model';
import { DataService } from './../../../../../core/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, NgModule, OnInit, EventEmitter, OnDestroy, ViewContainerRef } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import { ToastsManager } from 'ng2-toastr';


@Component({
  selector: 'sacpi-requirement-edit',
  templateUrl: './requirement-edit.component.html',
  styleUrls: ['./requirement-edit.component.scss']
})
export class RequirementEditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  loading = false;
  working = false;
  Codigo: string;

  requirementType: any[] = [];
  expedients: any[] = [];
  units: any[] = [];
  products: any[] = [];

  requirementSub: Subscription;
  routingSub: Subscription;
  search = new EventEmitter<string>();

  // numberMask = { allowDecimal: true, decimalLimit: 2 };

  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private dataService: DataService,
    private notification: ToastsManager,
    private viewContainerRef: ViewContainerRef
  ) {
    this.notification.setRootViewContainerRef(viewContainerRef);
    this.search
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap(term => this.searchProduct(term))
      .subscribe(items => {
        this.products = items;
      }, (err) => {
        this.products = [];
      });
  }
  ngAfterViewInit() {
    let requirementObs = Observable.interval(10000);
    this.requirementSub = requirementObs.subscribe(item => this.saveAll());
  }

  ngOnDestroy(): void {
    this.requirementSub.unsubscribe();
    this.routingSub.unsubscribe();
  }

  ngOnInit() {
    this.loading = true;
    this.routingSub = this.route.params.subscribe(params => {
      let id = +params['id'];
      this.buildForm();
      this.loadDataForm();
      this.dataService.requeriments().findById(id).subscribe((data: any) => {
        this.Codigo = data.CodRequirement;
        this.form.patchValue({
          CodRequirement: data.CodRequirement,
          IdRequirement: data.IdRequirement,
          AtentionDate: data.AtentionDate,
          IdExpedient: data.IdExpedient,
          IdTypeRequirement: data.IdTypeRequirement
        });
        let detalle = data.RequirementDetails || [];
        detalle.forEach(item => {
          const formGroup = this.formBuilder.group({
            IdRequirementDetails: [item.IdRequirementDetails, Validators.compose([Validators.maxLength(150)])],
            IdProduct: [item.Product, Validators.compose([Validators.required, Validators.minLength(1)])],
            IdUnidCode: [item.IdUnidCode, Validators.compose([Validators.required, Validators.minLength(1)])],
            Quantity: [item.Quantity, Validators.compose([Validators.required, Validators.minLength(1)])],
            Observation: [item.Observation, Validators.compose([Validators.maxLength(150)])],
            Accumulate: [item.Accumulate, Validators.compose([Validators.maxLength(150)])],
            Status: [1]
          });
          this.addObservableControl(formGroup);
          this.detalle.push(formGroup);
        });
        this.loading = false;
      },
        (error) => {
          this.loading = false;
        });
    });
  }
  buildForm() {
    this.form = this.formBuilder.group({
      IdRequirement: [null, Validators.compose([Validators.maxLength(50)])],
      CodRequirement: [null, Validators.compose([Validators.maxLength(50)])],
      AtentionDate: [null, Validators.compose([Validators.maxLength(200)])],
      IdExpedient: [null, Validators.compose([Validators.required])],
      IdTypeRequirement: [null, Validators.compose([Validators.required])],
      detalle: this.formBuilder.array([], Validators.compose([]))
    });
  }
  addDetalleFormControl(): void {
    const formGroup = this.formBuilder.group({
      IdRequirementDetails: [null, Validators.compose([Validators.maxLength(150)])],
      IdProduct: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      IdUnidCode: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      Quantity: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      Observation: [null, Validators.compose([Validators.maxLength(150)])],
      Accumulate: [null, Validators.compose([Validators.maxLength(150)])],
      Status: [2]
    });
    this.addObservableControl(formGroup);
    this.detalle.push(formGroup);
  }
  loadDataForm() {
    this.loadExpedients();
    this.loadUnitCodes();
    this.loadRequirementType();
  }

  addObservableControl(formGroup: FormGroup) {
    formGroup.get("IdProduct").valueChanges.subscribe(value => {
      formGroup.patchValue({ Status: 2 });
    });
    formGroup.get("IdUnidCode").valueChanges.subscribe(value => {
      formGroup.patchValue({ Status: 2 });
    });
    formGroup.get("Quantity").valueChanges.subscribe(value => {
      formGroup.patchValue({ Status: 2 });
    });
    formGroup.get("Observation").valueChanges.subscribe(value => {
      formGroup.patchValue({ Status: 2 });
    });
  }

  loadExpedients() {
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => { this.expedients = data; });
  }

  loadUnitCodes() {
    this.dataService.unitcodes().getAll().subscribe((data: any[]) => { this.units = data; });
  }

  loadRequirementType() {
    this.dataService.requerimenttype().getAll().subscribe((data: any[]) => { this.requirementType = data; });
  }

  searchProduct(value: string): Observable<any[]> {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('filter', value);
    queryParams.set('top', '20');
    return this.dataService.products().getAll(queryParams);
  }

  saveAll() {
    let iduser = this.dataService.users().getUserId();
    if (!this.form || !this.form.value.IdExpedient || !this.form.value.IdTypeRequirement) {
      return;
    }
    this.detalle.controls.forEach(formControl => {
      let element = formControl.value;
      if (element.Status === 2 && element.IdProduct && element.IdUnidCode && element.Quantity) {
        let details: any[] = [];
        details.push({
          IdRequirementDetails: element.IdRequirementDetails,
          IdProduct: element.IdProduct.IdProducto,
          IdUnidCode: element.IdUnidCode,
          Quantity: element.Quantity,
          Observation: element.Observation
        });
        let requerimiento = {
          AtentionDate: new Date(),
          IdExpedient: this.form.value.IdExpedient,
          IdTypeRequirement: this.form.value.IdTypeRequirement,
          IdRequirement: this.form.value.IdRequirement,
          IdUser: iduser,
          Details: details
        };
        this.dataService.requeriments().create(requerimiento).subscribe(response => {
          this.notification.success('Nuevo Producto agregado al requerimiento.', 'Informacion');
          this.form.patchValue({
            CodRequirement: response.CodRequirement,
            IdRequirement: response.IdRequirement
          });
          formControl.patchValue({
            IdRequirementDetails: response.Details[0].IdRequirementDetails,
            Accumulate: response.Details[0].Accumulate,
            Status: 1
          });
        },
          (error) => {
            this.notification.warning('Problemas al agregar producto al requerimiento.', 'Alerta');
          });
      }
    });
  }

  removeDetalleFormControl(item: FormGroup, index: number) {
    let id = item.value.IdRequirementDetails;
    let iduser: any = this.dataService.users().getUserId();
    if (id) {
      const queryParams: URLSearchParams = new URLSearchParams();
      queryParams.set('id', id);
      queryParams.set('idUser', iduser);
      this.dataService.requeriments().deletedetail(queryParams).subscribe((data) => {
        this.detalle.removeAt(index);
        this.notification.info('Producto eliminado del requiremiento.', 'Informacion');
      },
        (error) => {
          this.notification.error('Error al eliminar producto del requerimiento.', 'Error');
        });

    } else {
      this.detalle.removeAt(index);
    }
  }

  confirmar(form: FormGroup): void {
    if (!form.value.detalle || form.value.detalle.length === 0) {
      this.notification.warning('Agrege al menos un detalle al requerimiento.', 'Alerta');
      return;
    }
    let details: any[] = [];

    let iduser = this.dataService.users().getUserId();
    this.detalle.controls.forEach(formControl => {
      let element = formControl.value;
      if (element.Status === 2 && element.IdProduct && element.IdUnidCode && element.Quantity) {
        details.push({
          IdRequirementDetails: element.IdRequirementDetails,
          IdProduct: element.IdProduct.IdProducto,
          IdUnidCode: element.IdUnidCode,
          Quantity: element.Quantity,
          Observation: element.Observation
        });
      }
    });
    let requerimiento = {
      AtentionDate: new Date(),
      IdExpedient: this.form.value.IdExpedient,
      IdTypeRequirement: this.form.value.IdTypeRequirement,
      IdRequirement: this.form.value.IdRequirement,
      IdUser: iduser,
      Details: details
    };
    if (details.length > 0) {
      this.dataService.requeriments().create(requerimiento).subscribe(response => {
        this.notification.success('Nuevo Producto agregado al requerimiento.', 'Informacion');
        this.enviar(form);
      },
        (error) => {
          this.notification.warning('Problemas al agregar producto al requerimiento.', 'Alerta');
        });

    } else {
      this.enviar(form);
    }
  }

  enviar(form: FormGroup) {
    let iduser: any = this.dataService.users().getUserId();
    this.working = true;
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('idRequeriment', form.value.IdRequirement);
    queryParams.set('idUser', iduser);
    this.dataService.requeriments().confirmar(queryParams).subscribe(
      response => {
        this.notification.info('Requerimiento enviado a la central', 'Informacion');
        this.working = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error => {
        this.notification.warning('Requerimiento no enviado.', 'Alerta');
        this.working = false;
      }
    );
  }

  save(status: boolean) {
    if (!this.form.value.detalle || this.form.value.detalle.length === 0) {
      this.notification.warning('Agrege al menos un detalle al requerimiento.', 'Alerta');
      return;
    }
    let details: any[] = [];

    let iduser = this.dataService.users().getUserId();
    this.detalle.controls.forEach(formControl => {
      let element = formControl.value;
      if (element.Status === 2 && element.IdProduct && element.IdUnidCode && element.Quantity) {
        details.push({
          IdRequirementDetails: element.IdRequirementDetails,
          IdProduct: element.IdProduct.IdProducto,
          IdUnidCode: element.IdUnidCode,
          Quantity: element.Quantity,
          Observation: element.Observation
        });
      }
    });
    let requerimiento = {
      AtentionDate: new Date(),
      IdExpedient: this.form.value.IdExpedient,
      IdTypeRequirement: this.form.value.IdTypeRequirement,
      IdRequirement: this.form.value.IdRequirement,
      IdUser: iduser,
      Details: details
    };
    if (details.length > 0) {
      this.dataService.requeriments().create(requerimiento).subscribe(response => {
        this.notification.success('Nuevo Producto agregado al requerimiento.', 'Informacion');
        this.working = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      },
        (error) => {
          this.notification.warning('Problemas al agregar producto al requerimiento.', 'Alerta');
        });
    } else {
      this.router.navigate(['../'], { relativeTo: this.route });
    }
  }
  cancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }
  get detalle(): FormArray {
    return this.form.get('detalle') as FormArray;
  }
}
