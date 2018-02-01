import { GenericType } from './../../../../../core/model/genericType.model';
import { DataService } from './../../../../../core/data/data.service';
//import { ToastsManager } from 'ng2-toastr';
//import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, NgModule, OnInit, Input, EventEmitter } from '@angular/core';
import { URLSearchParams } from '@angular/http';
import { FormGroup, FormBuilder, FormControl, Validators, FormArray } from '@angular/forms';

import {Observable} from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/distinctUntilChanged';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/switchMap';


@Component({
  selector: 'sacpi-requirement-create',
  templateUrl: './requirement-create.component.html',
  styleUrls: ['./requirement-create.component.scss']
})
export class RequirementCreateComponent implements OnInit {

  form: FormGroup;
  @Input('IdRequirement') IdRequirement: number = 123;
  working = false;
  itemworking = false;

  // expedients: GenericType[];
  expedients: any[] = [];
  units: any[] = [];
  products: any[] = [];

  search = new EventEmitter<string>();

  numberMask = { allowDecimal: true, decimalLimit: 2 };

  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, //private modalService: NgbModal,
    private dataService: DataService//, private toastr: ToastsManager
  ) {
    this.search
      .distinctUntilChanged()
      .debounceTime(200)
      .switchMap(term => this.searchProduct(term))
      .subscribe(items => {
        this.products = items;
      }, (err) => {
        console.log(err);
        this.products = [];
      });
  }
  ngAfterViewInit() {
    console.log(this.IdRequirement);
  }

  ngOnInit() {
    this.buildForm();
    this.loadDataForm();
  }
  buildForm() {
    this.form = this.formBuilder.group({
      IdRequirement: [null, Validators.compose([Validators.maxLength(50)])],
      CodRequirement: [null, Validators.compose([Validators.maxLength(50)])],
      AtentionDate: [null, Validators.compose([Validators.required])],
      IdExpedient: [null, Validators.compose([Validators.required])],
      detalle: this.formBuilder.array([], Validators.compose([]))
    });
    this.detalle.valueChanges.subscribe(value => {
      //  this.recalcularDatos();
    });
  }

  loadDataForm() {
    this.loadExpedients();
    this.loadUnitCodes();
  }

  addDetalleFormControl(): void {
    const formGroup = this.formBuilder.group({
      IdRequirementDetails: [null, Validators.compose([Validators.maxLength(150)])],
      IdProduct: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      IdUnidCode: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      Quantity: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
      Observation: [null, Validators.compose([Validators.maxLength(150)])],
      Acomulate: [null, Validators.compose([Validators.maxLength(150)])],
      UpdateMode: [false],
    });
    this.detalle.push(formGroup);
  }

  removeDetalleFormControl(index) {
    this.detalle.removeAt(index);
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

  searchProduct(value: string): Observable<any[]> {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('filter', value);
    queryParams.set('top', '20');
    return this.dataService.products().getAll(queryParams);
  }
  // public searchProduct(value?: string): void {
  //   if (value != undefined && value.length > 3) {
  //     const queryParams: URLSearchParams = new URLSearchParams();
  //     queryParams.set('filter', value);
  //     queryParams.set('top', '20');
  //     this.dataService.products().getAll(queryParams).subscribe((data: any[]) => { this.products = data; });
  //   }
  // }

  save(form: FormGroup, formdetalle: FormGroup): void {
    console.log(formdetalle);
    let item = form.value;
    //this.itemworking = true;
    let detail: any[] = [];
    console.log(item);
    let id = this.dataService.users().getUserId();
    // this.detalle.push({
    //   IdRequirementDetails: item.IdRequirementDetails,
    //   Product: item.IdProduct[0].text,
    //   UnidCode: item.IdUnidCode[0].text,
    //   Quantity: item.Quantity,
    //   Description: item.Observation
    // });

    // this.detalle.controls[index].value.ModeSave = false;
    // console.log(this.detalle.controls[index].value.ModeSave)
    // this.detalle.controls.forEach(formControl => {
    //   formControl.get('ModeSave').value;   

    // });

    // this.detalle.controls[index].patchValue({
    //   ModeSave: false
    // });


    formdetalle.patchValue({
      UpdateMode: true
    });


    detail.push({
      // IdRequirementDetails: item.detalle[index].IdRequirementDetails,
      // IdProduct: item.detalle[index].IdProduct[0].id,
      // IdUnidCode: item.detalle[index].IdUnidCode[0].id,
      // Quantity: item.detalle[index].Quantity,
      // Description: item.detalle[index].Observation
    });
    // let requeriment: any = {
    //   IdRequirement: this.IdRequirement,
    //   AtentionDate: item.AtentionDate,
    //   Description: item.Description,
    //   IdUser: id,
    //   IdExpedient: item.IdExpedient[0].id,
    //   Details: detail
    // }









    // this.dataService.requeriments().create(requeriment).subscribe(
    //   response => {
    //     console.log(response);
    //   //  this.detalle = response;
    //     this.itemworking = false;
    //     this.toastr.success('Success! Agregado correctamente.');
    //     this.buildForm();
    //   },
    //   error => {
    //     this.itemworking = false;
    //   }
    // );
  }




  get detalle(): FormArray {
    return this.form.get('detalle') as FormArray;
  }

}
