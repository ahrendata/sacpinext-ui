import { Component, OnInit, ViewContainerRef, ViewChild, TemplateRef } from '@angular/core';

import { ToastsManager } from 'ng6-toastr';
import { URLSearchParams } from '@angular/http';

//for toolbar
import { ActionConfig } from 'patternfly-ng/action';
import { Filter, FilterConfig, FilterField, FilterEvent, FilterType } from 'patternfly-ng/filter';
import { SortConfig, SortEvent, SortField } from 'patternfly-ng/sort';

import { ToolbarConfig, ToolbarView } from 'patternfly-ng/toolbar';

//for list
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import {  ListConfig, ListEvent } from 'patternfly-ng/list';


//for pagination
import { PaginationConfig, PaginationEvent } from 'patternfly-ng/pagination';

// ConfirmationModalComponent
import { SearchCriteriaFilter } from '../../../../core/model/search-criteria-filter.model';
import { Paging } from '../../../../core/model/paging.model';
import { DataService } from '../../../../core/data/data.service';
// import { ConfirmationModalComponent } from 'src/app/shared/components/confirmation-modal/confirmation-modal.component';

import { BsModalService } from 'ngx-bootstrap';

import { OrderBy } from '../../../../core/model/order-by.model';

import { setTheme } from 'ngx-bootstrap/utils';

import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from "ngx-bootstrap/chronos";
import { esLocale } from "ngx-bootstrap/locale";
import { SearchResults } from '../../../../core/model/search-results.model';

@Component({
  selector: 'sacpi-product-balance',
  templateUrl: './product-balance.component.html',
  styleUrls: ['./product-balance.component.scss']
})
export class ProductBalanceComponent implements OnInit {
  // @ViewChild('expandTemplate', {static: false}) expandTemplate: TemplateRef<any>;
  requirements: Array<any> = new Array<any>();//eliminar 
  filtersText: string = '';
  expedients: any[] = [];
  archivos: any[] = [];
  loading = false;
  filterConfig: FilterConfig;
  requirementType: any[] = [];
  sortConfig: SortConfig;
  toolbarConfig: ToolbarConfig;
  listConfig: ListConfig;
  paginationConfig: PaginationConfig;
  emptyStateConfig: EmptyStateConfig;
  idExpedienteSeleccionado: any;

  searchResult: SearchResults<any> = new SearchResults<any>();
  filters: Array<SearchCriteriaFilter> = new Array<SearchCriteriaFilter>();
  orderBy: OrderBy = {
    name: 'textoCodigoProdDenominacion',
    ascending: false
  };
  paging: Paging = {
    page: 1,
    pageSize: 5
  };

  centroCostoName: string = "";
  idExpediente: number;
  IdExpediente: number;
  idUsuario: number;
  idTrabajador: number;
  allRows: any[];
  filteredRows: any[];

  //totales
  totalCantidadPedida: number = 0;
  totalComprado: number = 0;
  totalParcial: number = 0;
  totalNotaSalida: number = 0;
  totalSaldo: number = 0;

  //gastos generales
  gastoTotalCantidadPedida: number = 0;
  gastoTotalComprado: number = 0;
  gastoTotalParcial: number = 0;
  gastoTotalNotaSalida: number = 0;
  gastoTotalSaldo: number = 0;

  //datePicker 
  

  constructor(private dataService: DataService,
    private bsModalService: BsModalService,
    private toastr: ToastsManager,
    private localeService : BsLocaleService,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
    setTheme('bs4');
  }

  ngOnInit() {
    //datePicker
    defineLocale("es", esLocale);
    this.localeService.use('es');

    this.emptyStateConfig = {
      iconStyleClass: 'pficon-warning-triangle-o',
      title: 'Ningún Producto',
      info: 'Seleccione un centro de costo y luego pulse en el boton Consultar',
    } as EmptyStateConfig;

    this.allRows = [];
    this.filteredRows = this.allRows;

    this.inittoolbar();
    this.loadExpedients();

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      showCheckbox: true,
      useExpandItems: true
    } as ListConfig;

    this.paginationConfig = {
      pageSize: 10,
      pageNumber: 1,
      totalItems: this.filteredRows.length
    } as PaginationConfig;

  //  this.updateRows();
  }

  inittoolbar() {
    // this.updateRows();
    this.filterConfig = {
      fields: [{
        id: 'textoCodigoProdDenominacion',
        title: 'Descripcion Producto',
        placeholder: 'busqueda por descripción del Producto...',
        type: FilterType.TEXT
      }
      ] as FilterField[],
      resultsCount: this.allRows.length,
      appliedFilters: [],
      totalCount: this.allRows.length
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'textoCodigoProdDenominacion',
        title: 'Descripcion Producto',
        sortType: 'alpha'
      }],
      isAscending: false
    } as SortConfig;

    this.toolbarConfig = {
      filterConfig: this.filterConfig,
      sortConfig: this.sortConfig,
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

  //centros de costo
  loadExpedients() {
    this.loading = true;
    let id = this.dataService.users().getEmployeeId();
    this.idUsuario = this.dataService.users().getUserId();
    this.idTrabajador = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => {
      this.expedients = data;
      this.loading = false;
      this.expedients.forEach(element => {
        if (element.IdExpediente == this.idExpediente) {
          this.centroCostoName = element.Alias;
        }
      });
    });
  }
  
  //for pagination
  handlePageSize($event: PaginationEvent) {
    console.log("event size "+ JSON.stringify($event));
    this.paging.pageSize = $event.pageSize;
     this.paginationAll();
  }

  handlePageNumber($event: PaginationEvent) {
    console.log("event number "+ JSON.stringify($event));
    this.paging.page = $event.pageNumber;
    this.paginationAll();
  }

  handleSortChanged($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.allRows.sort((item1: any, item2: any) => this.compare(item1, item2));
    this.applyFilters(this.filterConfig.appliedFilters || []);
  }

  // Sort
  currentSortField: SortField;
  isAscendingSort: boolean = true;
  compare(item1: any, item2: any): number {    
    let compValue = 0;
    if (this.currentSortField.id === 'textoCodigoProdDenominacion') {
      if(item1.textoCodigoProdDenominacion){
        compValue = item1.textoCodigoProdDenominacion.localeCompare(item2.textoCodigoProdDenominacion);
      }
     } 
  
    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  // View
  viewSelected(currentView: ToolbarView): void {
    this.sortConfig.visible = (currentView.id === 'tableView' ? false : true);
  }

  filterChanged($event: FilterEvent): void {
      this.filtersText = '';
      $event.appliedFilters.forEach((filter) => {
        this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
      });
      this.applyFilters($event.appliedFilters);
  }

  filterRows : boolean = false;

  applyFilters(filters: Filter[]): void {
     this.filteredRows = [];
     if (filters && filters.length > 0) {
       this.allRows.forEach((item) => {
         if (this.matchesFilters(item, filters)) {
           this.filteredRows.push(item);
         }
       });
     } else {
       this.filteredRows = this.allRows;
     }
     this.filterRows = true;
     this.requirements = this.filteredRows;
     this.toolbarConfig.filterConfig.resultsCount = this.filteredRows.length;
     this.paginationAll();
    //  this.cambio();
   }

  matchesFilter(item: any, filter: Filter): boolean {
    let match = true;
    let re = new RegExp(filter.value, 'i');
    try {
      if (filter.field.id === 'textoCodigoProdDenominacion') {
        match = item.textoCodigoProdDenominacion.match(re) !== null;
      }
      return match;
    } catch (error) {
      console.log("error ", error);
    }

  }

  matchesFilters(item: any, filters: Filter[]): boolean {
    let matches = true;
    filters.forEach((filter) => {
      if (!this.matchesFilter(item, filter)) {
        matches = false;
        return matches;
      }
    });
    return matches;
  }

  search() {
    console.log("search ");
    console.log(" date Inicial " + (<HTMLInputElement>document.getElementById("dateInicial")).value);
    console.log("initial " + this.dateInicial);
    
    if(this.idExpedienteSeleccionado){      
      const queryParams: URLSearchParams = new URLSearchParams();
      queryParams.set('idProyecto', this.idExpedienteSeleccionado);
      queryParams.set('mayor', "");
      queryParams.set('fechaIni', this.dateInicial);
      queryParams.set('fechaFin', this.dateFinal);
      this.dataService.requeriments().getAllSaldo(queryParams).subscribe((data: any[]) => {        
        this.allRows = data;
        this.paginationConfig.totalItems= data.length;
        this.paginationAll();
        this.totalGeneral();
      });
    }else{
      this.toastr.warning('Seleccione un centro de costo ', 'Informacion');
    }
  }

  paginationAll(){
    if(this.filterRows){
      this.paginationConfig.pageNumber =1;
      this.paginationConfig.pageSize= 10;
      this.paginationConfig.totalItems= this.filteredRows.length;
      this.requirements = this.filteredRows.slice(((this.paginationConfig.pageNumber-1) * this.paginationConfig.pageSize), (this.paginationConfig.pageNumber * this.paginationConfig.pageSize));
      this.filterRows = false;
    }else{
      this.paginationConfig.totalItems= this.allRows.length;
      this.requirements = this.allRows.slice(((this.paginationConfig.pageNumber-1) * this.paginationConfig.pageSize), (this.paginationConfig.pageNumber * this.paginationConfig.pageSize));
    }
  }

    // Selection
    handleSelectionChange($event: ListEvent): void {
      this.totalCantidadPedida = 0;
      this.totalComprado = 0;
      this.totalParcial = 0;
      this.totalNotaSalida = 0;
      this.totalSaldo = 0;
  
      // this.actionsText = $event.selectedRows.length + ' rows selected\r\n' + this.actionsText;
      this.toolbarConfig.filterConfig.selectedCount = $event.selectedItems.length;
      if ($event.selectedItems.length) {
          $event.selectedItems.forEach(row => {
            try {
            if (row.Cantidad) {
              this.totalCantidadPedida = this.totalCantidadPedida + parseFloat(row.Cantidad.replace(/,/g, ''));
            }
            if (row.CantidadOrden) {
              this.totalComprado = this.totalComprado + parseFloat(row.CantidadOrden.replace(/,/g, ''));
            }
            if (row.Parcial) {
              this.totalParcial = this.totalParcial + parseFloat(row.Parcial);
            }
            if (row.CantidadNotaSalida) {
              this.totalNotaSalida = this.totalNotaSalida + parseFloat(row.CantidadNotaSalida.replace(/,/g, ''));
            }
    
            if (row.Saldo) {
              this.totalSaldo = this.totalSaldo + parseFloat(row.Saldo.replace(/,/g, ''));
            }
          } catch (error) {
            console.log("error ", error );
          }
    
          });      
        
      }
    }


  totalGeneral(){
    this.allRows.forEach(row => {
      try {
        if (row.Cantidad) {
          this.gastoTotalCantidadPedida = this.gastoTotalCantidadPedida + parseFloat(row.Cantidad.replace(/,/g, ''));
        }
        if (row.CantidadOrden) {
          this.gastoTotalComprado = this.gastoTotalComprado + parseFloat(row.CantidadOrden.replace(/,/g, ''));
        }
        if (row.Parcial) {
          this.gastoTotalParcial = this.gastoTotalParcial + parseFloat(row.Parcial);
        }
        if (row.CantidadNotaSalida) {
          this.gastoTotalNotaSalida = this.gastoTotalNotaSalida + parseFloat(row.CantidadNotaSalida.replace(/,/g, ''));
        }

        if (row.Saldo) {
          this.gastoTotalSaldo = this.gastoTotalSaldo + parseFloat(row.Saldo.replace(/,/g, ''));
        }
      } catch (error) {
        //console.log("error "+ error );
      }

    });
  }

  cambio(idExpediente) {
    (<HTMLInputElement>document.getElementById("dateInicial")).value = "";
    (<HTMLInputElement>document.getElementById("dateFinal")).value = "";
    this.dateInicial="";
    this.dateFinal = "";
    this.toolbarConfig.disabled = false;
    this.toolbarConfig.filterConfig.totalCount = 0;
    this.filterConfig.appliedFilters = [];
    this.allRows = [];
    //gasto seleccionado
    this.totalCantidadPedida = 0;
    this.totalComprado = 0;
    this.totalParcial = 0;
    this.totalNotaSalida = 0;
    this.totalSaldo = 0;
    //gastos totales
    this.gastoTotalCantidadPedida = 0;
    this.gastoTotalComprado = 0;
    this.gastoTotalParcial = 0;
    this.gastoTotalNotaSalida = 0;
    this.gastoTotalSaldo = 0;
    this.paginationAll();

  }

  //datePicker
  dateInicial: any ="";
  dateFinal: any ="";
  onValueChangeInicial(value : Date){
    this.allRows = [];
    this.dateInicial = value.getDate() +"/"+(value.getMonth() + 1) +"/"+ value.getFullYear();
    this.paginationAll();
  }

  onValueChangeFinal(value : Date){
    this.allRows=[];
    this.dateFinal = value.getDate() +"/"+(value.getMonth() + 1 )+"/"+ value.getFullYear();
    this.paginationAll();
  }
}
