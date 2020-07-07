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
import { DatePipe, CurrencyPipe } from '@angular/common';
import { Subscription } from 'rxjs/Subscription';
import { ActionConfig } from 'patternfly-ng/action';
import { ToolbarConfig } from 'patternfly-ng/toolbar';
import { ToastsManager } from 'ng6-toastr/src/toast-manager';

import 'jspdf-autotable';
import * as jsPDF from 'jspdf'


@Component({
  selector: 'sacpi-requirement-view',
  templateUrl: './requirement-view.component.html',
  styleUrls: ['./requirement-view.component.scss'],
  providers: [DatePipe, CurrencyPipe]
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
    private viewContainerRef: ViewContainerRef,
    private datePipe: DatePipe,
    private number: CurrencyPipe
  ) {
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
      queryParams.set('id', id);
      queryParams.set('idUser', iduser);
      this.dataService.requeriments().delete(queryParams).subscribe((data) => {
        this.notification.success('El requerimiento fue eliminado correctamente.', 'Informacion');
        this.router.navigate(['../../'], { relativeTo: this.route });
      },
        (error) => {
          this.notification.error('Error al eliminar el requerimiento, por favor intente de nuevo.', 'Error');
        });
    }
  }

  imprimir() {
    let requirement = this.requirement;
    let CreateDate = this.datePipe.transform(requirement.CreateDate, 'dd/MM/yyyy HH:mm:ss');
    let AtentionDate = this.datePipe.transform(requirement.AtentionDate, 'dd/MM/yyyy');
    let columns = [
      { title: "#", dataKey: "Id" },
      { title: "Producto", dataKey: "Product" },
      { title: "Cantidad", dataKey: "Quantity" },
      { title: "Unidad Medida", dataKey: "UnidCode" },
      { title: "Descripcion", dataKey: "Observation" }
    ];
    let rows: any[] = [];
    let i: number = 0;
    this.requirement.RequirementDetails.forEach(element => {
      i++;
      rows.push({
        Id: i,
        Product: element.Product,
        Quantity: this.number.transform(element.Quantity, ' ', true, '1.2-2'),
        UnidCode: element.UnidCode,
        Observation: element.Observation || ''
      });
    });
    var doc = new jsPDF();
    doc.autoTable(columns, rows, {
      headerStyles: { fillColor: [114, 118, 123] },
      columnStyles: {
        Id: { columnWidth: 7, halign: 'right' },
        Product: { columnWidth: 120 },
        Quantity: { columnWidth: 20, halign: 'right' },
        UnidCode: { columnWidth: 13, halign: 'center' }
      },
      bodyStyles: { valign: 'middle' },
      showHeader: 'firstPage',
      tableLineColor: 200,
      tableLineWidth: 0.2,
      styles: {
        fillColor: [209, 209, 209],
        cellPadding: 0.7,
        fontSize: 8,
        overflow: 'linebreak'
      },
      margin: { top: 45, right: 10, left: 10 },
      addPageContent: function (data) {
        doc.setFontSize(12);
        doc.setFontStyle('bold');
        doc.text(70, 20, 'REQUERIMIENTO N° ' + requirement.CodRequirement);
        doc.setFontSize(8);
        doc.setFontStyle('normal');
        doc.text(10, 30, 'Fecha creación');
        doc.text(35, 30, ':');
        doc.text(40, 30, CreateDate);
        doc.text(100, 30, 'Tipo Requerimiento');
        doc.text(135, 30, ':');
        doc.text(140, 30, requirement.TypeRequirement || '');
        doc.text(10, 35, 'Fecha Atención');
        doc.text(35, 35, ':');
        doc.text(40, 35, AtentionDate);
        doc.text(100, 35, 'Centro de Costo');
        doc.text(135, 35, ':');
        doc.text(140, 35, requirement.AliasExpedient);
        doc.text(10, 40, 'Estado');
        doc.text(35, 40, ':');
        doc.text(40, 40, requirement.Status ? 'Confirmado' : 'Sin Confirmar');
      }
    });
    doc.save('Req-' + this.requirement.CodRequirement + '.pdf');

  }
  cancel() {
    this.router.navigate(['../../'], { relativeTo: this.route });
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
    this.dataService.files().DownloadById(id).subscribe((data) => {
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
      } else {
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
    },
      (error) => {
        this.notification.error('Error al descargar el archivo, por favor intente de nuevo.', 'Error');
      });
  }
}
