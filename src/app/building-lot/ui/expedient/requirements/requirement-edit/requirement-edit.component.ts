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
    this.requirementSub = requirementObs.subscribe(item => {
      if (!this.working) {
        this.saveAll();
      }
    });
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
          Description: data.Description,
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
            Status: [1],
            Duplicate: [0],
            Delete: [0]
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
      Description: [null, Validators.compose([Validators.maxLength(200)])],
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
      Status: [2],
      Duplicate: [0],
      Delete: [0]
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
      this.allnotDuplicate();
      let id = value.IdProducto, status = false;
      this.detalle.controls.forEach(element => {
        let item = element.value.IdProduct;
        if (item) {
          let form = this.detalle.controls.filter((f) => f.value.Duplicate === 0 && f.value.IdProduct && f.value.IdProduct.IdProducto === item.IdProducto), record = form.length;
          if (record > 1) {
            form.forEach(formControl => {
              formControl.patchValue({ Duplicate: 1 });
            });
          }
        }
      });
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
    this.loading = true;
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => { this.expedients = data; this.loading = false; });
  }

  loadUnitCodes() {
    this.loading = true;
    this.dataService.unitcodes().getAll().subscribe((data: any[]) => { this.units = data; this.loading = false; });
  }

  loadRequirementType() {
    this.loading = true;
    this.dataService.requerimenttype().getAll().subscribe((data: any[]) => { this.requirementType = data; this.loading = false; });
  }

  searchProduct(value: string): Observable<any[]> {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('filter', value);
    queryParams.set('top', '20');
    return this.dataService.products().getAll(queryParams);
  }

  allnotDuplicate(): void {
    this.detalle.controls.forEach(element => {
      element.patchValue({ Duplicate: 0 });
    });
  }

  saveAll(confirm: boolean = false, home: boolean = false) {
    let iduser = this.dataService.users().getUserId();
    if (!this.form || !this.form.value.IdExpedient || !this.form.value.IdTypeRequirement || !this.form.value.Description) {
      if (home) { this.home(); }
      return;
    }
    let form = this.detalle.controls.filter((f) => f.valid && f.value.Status === 2), record = form.length;
    this.working = record > 0;
    if (!this.working) {
      if (confirm) { this.enviarConfirm(); }
      if (home) { this.home(); }
      return;
    }
    let details: any[] = [];
    form.forEach((formControl, i) => {
      let element = formControl.value;
      details.push({
        IdRequirementDetails: element.IdRequirementDetails,
        IdProduct: element.IdProduct.IdProducto,
        IdUnidCode: element.IdUnidCode,
        Quantity: element.Quantity,
        Observation: element.Observation
      });
    });
    let requerimiento = {
      AtentionDate: new Date(),
      IdExpedient: this.form.value.IdExpedient,
      Description: this.form.value.Description,
      IdTypeRequirement: this.form.value.IdTypeRequirement,
      IdRequirement: this.form.value.IdRequirement,
      IdUser: iduser,
      Details: details
    };
    this.dataService.requeriments().create(requerimiento).subscribe(response => {
      this.Codigo = response.CodRequirement;
      this.form.patchValue({
        CodRequirement: response.CodRequirement,
        IdRequirement: response.IdRequirement
      });
      response.Details.forEach(element => {
        form.forEach(formControl => {
          let item = formControl.value;
          if (item.IdProduct.IdProducto === element.IdProduct
            && item.IdUnidCode === element.IdUnidCode
            && item.Quantity === element.Quantity) {
            formControl.patchValue({
              IdRequirementDetails: element.IdRequirementDetails,
              Accumulate: element.Accumulate,
              Status: 1
            });
          }
        });
      });
      this.notification.success('Nuevo Producto agregado al requerimiento.', 'Informacion');
      this.working = false;
      if (confirm) { this.enviarConfirm(); }
      if (home) { this.home(); }
    },
      (error) => {
        this.notification.warning('Problemas al agregar producto al requerimiento.', 'Alerta');
        this.working = false;
      });
  }

  removeDetalleFormControl(formControl: FormGroup, index: number) {
    let id = formControl.value.IdRequirementDetails;
    let iduser: any = this.dataService.users().getUserId();
    if (this.working) { this.notification.warning('Operaciones en proceso, por favor espere hasta terminar y vuelva eliminar.', 'Alerta'); return; }
    formControl.patchValue({ Delete: 1 });
    if (id) {
      const queryParams: URLSearchParams = new URLSearchParams();
      queryParams.set('id', id);
      queryParams.set('idUser', iduser);
      this.dataService.requeriments().deletedetail(queryParams).subscribe((data) => {
        this.detalle.removeAt(index);
        this.notification.info('Producto eliminado del requiremiento.', 'Informacion');
      },
        (error) => {
          formControl.patchValue({ Delete: 0 });
          this.notification.error('Error al eliminar producto del requerimiento.', 'Error');
        });

    } else {
      this.detalle.removeAt(index);
    }
  }

  confirmar(form: FormGroup): void {
    if (this.working) {
      this.notification.warning('El requerimiento se esta guardando.... espere por favor.', 'Alerta');
      return;
    }
    this.saveAll(true, false);
  }

  enviarConfirm() {
    if (this.working) {
      this.notification.warning('El requerimiento se esta guardando.... espere por favor.', 'Alerta');
      return;
    }
    let iduser: any = this.dataService.users().getUserId();
    this.working = true;
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('idRequeriment', this.form.value.IdRequirement);
    queryParams.set('idUser', iduser);
    this.dataService.requeriments().confirmar(queryParams).subscribe(
      response => {
        this.notification.info('Requerimiento enviado a la central', 'Informacion');
        this.working = false;
        this.router.navigate(['../'], { relativeTo: this.route });
      },
      error => {
        this.working = false;
        this.notification.warning('Requerimiento no enviado.', 'Alerta');
      }
    );
  }

  home() {
    if (this.working) {
      this.notification.warning('El requerimiento se esta guardando.... espere por favor.', 'Alerta');
      return;
    }
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  cancel() {
    if (this.working) { this.notification.warning('El requerimiento se esta guardando.... espere por favor.', 'Alerta'); return; }
    this.saveAll(false, true);
  }

  get detalle(): FormArray {
    return this.form.get('detalle') as FormArray;
  }
}
