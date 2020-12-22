import { BsModalService } from 'ngx-bootstrap/modal';
import { GenericType } from './../../../../../core/model/genericType.model';
import { DataService } from './../../../../../core/data/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, NgModule, OnInit, EventEmitter, OnDestroy, ViewContainerRef, TemplateRef, ViewChild } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray, FormControlDirective } from '@angular/forms';
import { ToastsManager } from 'ng6-toastr';
import { Observable } from 'rxjs/Rx';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';
import { Subscription } from 'rxjs/Subscription';
import { ConfirmationModalComponent } from '../../../../../shared/components/confirmation-modal/confirmation-modal.component';


@Component({
  selector: 'sacpi-registry-edit',
  templateUrl: './registry-edit.component.html',
  styleUrls: ['./registry-edit.component.scss']
})
export class RegistryEditComponent implements OnInit {

  // Loading
  loading = false;
  working = false;

  // Form
  form: FormGroup;
  formup: FormGroup;

  // Lists
  expedients: any[] = [];

  routingSub: Subscription;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private notification: ToastsManager,
    private viewContainerRef: ViewContainerRef,
    private bsModalService: BsModalService,
    private toastr: ToastsManager) {
    this.notification.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {

    this.routingSub = this.route.params.subscribe(params => {
      let id = +params['id'];

      this.buildForm();
      this.loadDataForm();

      console.log(`Id a consultar ${id}`);

      this.dataService.sctrRegistry().findById(id).subscribe((data: any) => {

        if (data && data != null) {
          this.form.patchValue({
            IdRegistroSctr: data.idRegistroSctr,
            IdExpedient: data.idExpediente,
            Description: data.denominacion,
          });
          let detalle = data.detalle || [];
          detalle.forEach(item => {
            const formGroup = this.formBuilder.group({

              IdSctrDetalle: [item.idRegistroSctrDetalle, Validators.compose([Validators.maxLength(150)])],
              Nombres: [item.nombres, Validators.compose([Validators.maxLength(500)])],
              ApellidoPaterno: [item.apellidoPaterno, Validators.compose([Validators.maxLength(500)])],
              ApellidoMaterno: [item.apellidoMaterno, Validators.compose([Validators.maxLength(500)])],
              Dni: [item.dni, Validators.compose([Validators.maxLength(8)])],
              FechaNacimiento: [item.fechaNacimientoText],
              Delete: [0]
            });

            //this.addObservableControl(formGroup);
            this.detalle.push(formGroup);
          });

          this.loading = false;

        } else { // If no data
          this.router.navigate(['../'], { relativeTo: this.route });
        }
      },
        (error) => { // Catch error
          this.loading = false;
          this.router.navigate(['../'], { relativeTo: this.route });
        });
    });
  }

  ngOnDestroy(): void {
    this.routingSub.unsubscribe();
  }

  // Form
  buildForm() {
    this.form = this.formBuilder.group({
      IdRegistroSctr: [null, Validators.compose([Validators.maxLength(50)])],
      IdExpedient: [null, Validators.compose([Validators.required])],
      Description: [null, Validators.compose([Validators.required, Validators.maxLength(200)])],
      detalle: this.formBuilder.array([], Validators.compose([]))
    });
    this.formup = this.formBuilder.group({
      File: [''],
      FileName: ['']
    })
  }

  loadDataForm() {
    this.loadExpedients();
  }

  loadExpedients() {
    this.loading = true;
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => { this.expedients = data; this.loading = false; });
  }


  get detalle(): FormArray {
    return this.form.get('detalle') as FormArray;
  }


  addDetalleSctr(): void {

    const formGroup = this.formBuilder.group({
      IdSctrDetalle: [null, Validators.compose([Validators.maxLength(150)])],
      Nombres: [null, Validators.compose([Validators.maxLength(500)])],
      ApellidoPaterno: [null, Validators.compose([Validators.maxLength(500)])],
      ApellidoMaterno: [null, Validators.compose([Validators.maxLength(500)])],
      Dni: [null, Validators.compose([Validators.maxLength(10)])],
      FechaNacimiento: [null],
      Delete: [0]
    });

    this.detalle.push(formGroup);
  }

  removeDetalleFormControl(formControl: FormGroup, index: number) {

    let id = formControl.value.IdSctrDetalle;
    let iduser: any = this.dataService.users().getUserId();

    if (this.working) { this.notification.warning('Operaciones en proceso, por favor espere hasta terminar y vuelva eliminar.', 'Alerta'); return; }

    formControl.patchValue({ Delete: 1 });

    if (id) {

      console.log('Eliminando desde el backend');
      this.detalle.removeAt(index);
      // const queryParams: URLSearchParams = new URLSearchParams();
      // queryParams.set('id', id);
      // queryParams.set('idUser', iduser);
      // this.dataService.requeriments().deletedetail(queryParams).subscribe((data) => {
      //   this.detalle.removeAt(index);
      //   this.notification.info('Producto eliminado del requerimiento.', 'Informacion');
      // },
      //   (error) => {
      //     formControl.patchValue({ Delete: 0 });
      //     this.notification.error('Error al eliminar producto del requerimiento.', 'Error');
      //   });

    } else {
      this.detalle.removeAt(index);
    }
  }

  // Consulta DNI
  consultarPersona(formControl: FormGroup, index: number) {

    let dni = formControl.value.Dni;

    if (dni && dni !== null && dni !== "") {

      console.log('Servicio consultar trabajador', dni);

      

      this.dataService.sctrRegistry().consultarDni(dni).subscribe(response => {

        if (response.data.data && response.data.data !== null) {

          const responseData = response.data.data;
          console.log(responseData);

          if (responseData.fechaNacimiento && responseData.fechaNacimiento !== null && responseData.fechaNacimiento !== "") {

            formControl.patchValue({
              ApellidoPaterno: responseData.apellidoPaterno,
              ApellidoMaterno: responseData.apellidoMaterno,
              Nombres: responseData.nombres,
              FechaNacimiento: responseData.fechaNacimiento
            });

          } else {
            formControl.patchValue({
              ApellidoPaterno: responseData.apellidoPaterno,
              ApellidoMaterno: responseData.apellidoMaterno,
              Nombres: responseData.nombres,
            });
          }
        } else {
          this.notification.warning('No se pudo consultar el DNI ingresado', 'Alerta');
        }
        this.working = false;
      },
        (error) => { // Cath Error
          this.notification.warning('No se pudo consultar el DNI ingresado', 'Alerta');
          this.working = false;
        });
    }
    else {
      this.notification.error('Debe ingresar el número de DNI.', 'Informacion');
    }

  }

  // On Submit Form
  onSubmitForm(form: FormGroup): void {

    console.log('Guardando formulario');

    // Validando Formulario
    if (form && form !== null) {

      // Get User ID
      let idUsuario: any = this.dataService.users().getUserId();

      // Validando el detalle
      if (form.value.detalle && form.value.detalle.length > 0) {

        // Detalle
        let detalleSctr = [];
        detalleSctr = form.value.detalle.map(q => {
          return {
            idRegistroSctrDetalle: q.IdSctrDetalle,
            dni: q.Dni,
            nombres: q.Nombres,
            apellidoPaterno: q.ApellidoPaterno,
            apellidoMaterno: q.ApellidoMaterno,
            fechaNacimiento: q.FechaNacimiento !== null ? new Date(q.FechaNacimiento.replaceAll('-', '/')).toISOString() : null
          }
        });

        // Header
        let registroSctr = {
          idRegistroSctr: form.value.IdRegistroSctr,
          idExpediente: form.value.IdExpedient,
          denominacion: form.value.Description,
          idUsuarioCreacion: idUsuario,
          idUsuarioModificacion: idUsuario,
          detalle: detalleSctr
        }

        // Saving data
        this.dataService.sctrRegistry().create(registroSctr).subscribe(response => {
          this.notification.success('Registro SCTR Actualizado correctamente.', 'Informacion');
          this.router.navigate(['../'], { relativeTo: this.route });
        },
          (error) => { // Cath Error
            this.notification.warning('Problemas al guardar el Registro SCTR ', 'Alerta');
            this.working = false;
          });
      } else { // Lista vacia
        this.notification.error('Debe ingresar al menos un trabajador', 'Alerta');
      }
    } else { // Validar campos
      this.notification.error('Debe validar los datos', 'Alerta');
    }
  }

  // On Cancel Create
  onCancel() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

}
