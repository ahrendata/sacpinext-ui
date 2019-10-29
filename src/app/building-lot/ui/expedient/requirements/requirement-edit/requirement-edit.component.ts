import { BsModalService } from 'ngx-bootstrap/modal';
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
import { ToastsManager } from 'ng6-toastr';
import { ConfirmationModalComponent } from '../../../../../shared/components/confirmation-modal/confirmation-modal.component';

@Component({
  selector: 'sacpi-requirement-edit',
  templateUrl: './requirement-edit.component.html',
  styleUrls: ['./requirement-edit.component.scss']
})
export class RequirementEditComponent implements OnInit, OnDestroy {

  form: FormGroup;
  formup: FormGroup;
  loading = false;
  working = false;
  Codigo: string;

  requirementType: any[] = [];
  expedients: any[] = [];
  units: any[] = [];
  products: any[] = [];
  Archivos: any[] = [];

  requirementSub: Subscription;
  routingSub: Subscription;
  search = new EventEmitter<string>();


  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private dataService: DataService,
    private notification: ToastsManager,
    private viewContainerRef: ViewContainerRef,
    private bsModalService: BsModalService,
    private toastr: ToastsManager,
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

  archivosEdit: any[] = [];

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
            Observation: [item.Observation, Validators.compose([Validators.maxLength(500)])],
            Accumulate: [item.Accumulate, Validators.compose([Validators.maxLength(150)])],
            FileDetails: [item.FilesDetails],
            Status: [1],
            Duplicate: [0],
            Delete: [0],
            DeleteFile: [0]
          });
          this.archivosEdit = item.FilesDetails;
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
      IdTipoPedido: [2, Validators.compose([Validators.required])],
      detalle: this.formBuilder.array([], Validators.compose([]))
    });

    this.formup = this.formBuilder.group({
      File: [''],
      FileName: ['']
    })
  }
  addDetalleFormControl(): void {
    this.Archivos = [];
    this.valor = -1;
    const formGroup = this.formBuilder.group({
      IdRequirementDetails: [null, Validators.compose([Validators.maxLength(150)])],
      IdProduct: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      IdUnidCode: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      Quantity: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      Observation: [null, Validators.compose([Validators.maxLength(150)])],
      Accumulate: [null, Validators.compose([Validators.maxLength(150)])],
      FileDetails: [this.Archivos],
      Status: [2],
      Duplicate: [0],
      Delete: [0],
      // DeleteFile: [0]
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
    if(this.accion){
      setTimeout(() => this.addEnd(), 1000);
      this.accion = false;
    }

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
    formGroup.get("FileDetails").valueChanges.subscribe(value => {
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
    if (!this.form || !this.form.value.IdExpedient || !this.form.value.IdTypeRequirement) {
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
        Observation: element.Observation,
        FileDetails: element.FileDetails
      });
    });
    let requerimiento = {
      AtentionDate: new Date(),
      IdExpedient: this.form.value.IdExpedient,
      Description: this.form.value.Description,
      IdTypeRequirement: this.form.value.IdTypeRequirement,
      IdRequirement: this.form.value.IdRequirement,
      IdTipoPedido: this.form.value.IdTipoPedido,
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
              FileDetails : element.FileDetails,
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
        this.loadDataForm();//revisar
        this.notification.info('Producto eliminado del requerimiento.', 'Informacion');
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

  deleteFile(formControl: FormGroup, file : any, indexF, index) {
    let modal = this.bsModalService.show(ConfirmationModalComponent, { keyboard: false, backdrop: 'static' });
    (<ConfirmationModalComponent>modal.content).showConfirmationModal(
      'Estas Seguro de Eliminar el archivo  ',
      file.FileName
    );
    (<ConfirmationModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {

        let idFile = file.IdRequirementFileDetails;
        let idUser: any = this.dataService.users().getUserId();
        // llamada al servicio

        if (this.working) { this.notification.warning('Operaciones en proceso, por favor espere hasta terminar y vuelva eliminar.', 'Alerta'); return; }
        if (idFile) {
          const queryParams: URLSearchParams = new URLSearchParams();
          queryParams.set('idFile', idFile);
          queryParams.set('idUser', idUser);
          this.dataService.files().delete(queryParams).subscribe((data) => {
            this.detalle.value[index].FileDetails.splice(indexF, 1);
            this.notification.info('Archivo eliminado del requerimiento.', 'Informacion');
          },
            (error) => {
              formControl.patchValue({ Delete: 0 });
              this.notification.error('Error al eliminar Archivo del requerimiento.', 'Error');
            });

        } else {
          this.detalle.value[index].FileDetails.splice(indexF, 1);
        }

      }
    });

  }

  valorAnt: number;
  valor: number = -1;
  ocultar(ind) {

    let v = ind;
    if (v == this.valorAnt) {
      v = -1;
      if (v != null) {
        this.valor = v;
        this.valorAnt = this.valor;
      } else {
        this.valor = -1;
        this.valorAnt = this.valor;
      }
    } else {
      if (v != null) {
        this.valor = v;
        this.valorAnt = this.valor;
      } else {
        this.valor = -1;
        this.valorAnt = this.valor;
      }
    }

  }

  download(id) {
    this.dataService.files().DownloadById(id).subscribe(data => {
      var byteString = atob(data.File);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
       }

       var blob = new Blob([ia]);
       const fileName = data.FileName;
       if (navigator.msSaveBlob) {
         navigator.msSaveBlob(blob, fileName);
       }else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName);
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
      
    })
  }

  onFileChange(event: any) {
    if (this.formup == null) {
      return;
    } else {
        if(this.nuevo == true){
          this.formup.patchValue({
            File: event.data,
            FileName: event.fileName
          });
          this.Archivos.push(this.formup.value);
        }else{
        this.formup.patchValue({
          File: event.data,
          FileName: event.fileName
        });
        this.formEdit.value.FileDetails.push(this.formup.value);
        setTimeout(() => this.addObservableControl(this.formEdit), 5000);
        //this.addEnd(this.formedit);// solo es el tiempo
        this.accion = true;
        }
    }
 }

accion : boolean = false; 
nuevo: boolean= false;// si es false es antiguo, si es true es nuevo
formEdit : FormGroup;
indexR : number = null;

  addFiles(formControl : FormGroup, ind ) {
    this.ocultar(ind);

    if(formControl.value.IdRequirementDetails != null){
      this.nuevo = false;
      this.formEdit = formControl;
      this.indexR = ind;
     }else{
       this.nuevo = true;
     }
     
  }

  addEnd(){
    const formGroup = this.formBuilder.group({
      IdRequirementDetails: [this.formEdit.value.IdRequirementDetails, Validators.compose([Validators.maxLength(150)])],
      IdProduct: [this.formEdit.value.IdProduct, Validators.compose([Validators.required, Validators.minLength(1)])],
      IdUnidCode: [this.formEdit.value.IdUnidCode, Validators.compose([Validators.required, Validators.minLength(1)])],
      Quantity: [this.formEdit.value.Quantity, Validators.compose([Validators.required, Validators.minLength(1)])],
      Observation: [this.formEdit.value.Observation, Validators.compose([Validators.maxLength(150)])],
      Accumulate: [this.formEdit.value.Accumulate, Validators.compose([Validators.maxLength(150)])],
      FileDetails:  [this.formEdit.value.FileDetails],
      Status: [2],
      Duplicate: [0],
      Delete: [0],
          
    });

  this.addObservableControl(formGroup);
  this.detalle.insert(this.indexR,formGroup);
  this.detalle.removeAt(this.indexR+1);
  this.saveAll();
  this.accion = false;
  }
}
