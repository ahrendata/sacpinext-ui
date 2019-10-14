import { Component, OnInit, TemplateRef, ViewChild, ViewContainerRef } from '@angular/core';

import { ActionConfig } from '../../../../../../node_modules/patternfly-ng/action/action-config';
import { EmptyStateConfig } from '../../../../../../node_modules/patternfly-ng/empty-state/empty-state-config';
import { Filter } from '../../../../../../node_modules/patternfly-ng/filter/filter';
import { FilterConfig } from '../../../../../../node_modules/patternfly-ng/filter/filter-config';
import { FilterField } from '../../../../../../node_modules/patternfly-ng/filter/filter-field';
import { FilterEvent } from '../../../../../../node_modules/patternfly-ng/filter/filter-event';
import { FilterType } from '../../../../../../node_modules/patternfly-ng/filter/filter-type';
import { PaginationConfig } from '../../../../../../node_modules/patternfly-ng/pagination/pagination-config';
import { PaginationEvent } from '../../../../../../node_modules/patternfly-ng/pagination/pagination-event';
import { SortConfig } from '../../../../../../node_modules/patternfly-ng/sort/sort-config';
import { SortField } from '../../../../../../node_modules/patternfly-ng/sort/sort-field';
import { SortEvent } from '../../../../../../node_modules/patternfly-ng/sort/sort-event';
import { TableConfig } from '../../../../../../node_modules/patternfly-ng/table/basic-table/table-config';
import { TableEvent } from '../../../../../../node_modules/patternfly-ng/table/table-event';
import { ToolbarConfig } from '../../../../../../node_modules/patternfly-ng/toolbar/toolbar-config';
import { ToolbarView } from '../../../../../../node_modules/patternfly-ng/toolbar/toolbar-view';

import { DataService } from '../../../../core/data/data.service';
import { URLSearchParams } from '@angular/http';

import { ToastsManager } from 'ng2-toastr';
//datePicker

@Component({
  selector: 'sacpi-product-balance',
  templateUrl: './product-balance.component.html',
  styleUrls: ['./product-balance.component.scss']
})
export class ProductBalanceComponent implements OnInit {

  @ViewChild('productoTemplate') productoTemplate: TemplateRef<any>;
  @ViewChild('uMedTemplate') uMedTemplate: TemplateRef<any>;
  @ViewChild('cantpedTemplate') cantpedTemplate: TemplateRef<any>;
  @ViewChild('compradoTemplate') compradoTemplate: TemplateRef<any>;
  @ViewChild('parcialTemplate') parcialTemplate: TemplateRef<any>;
  @ViewChild('notaSalidaTemplate') notaSalidaTemplate: TemplateRef<any>;
  @ViewChild('saldoTemplate') saldoTemplate: TemplateRef<any>;
  @ViewChild('centroCostoTemplate') centroCostoTemplate: TemplateRef<any>;
  @ViewChild('nroNotasPedidoTemplate') nroNotasPedidoTemplate: TemplateRef<any>;
  // @ViewChild('nroNotasPedidoTotalTemplate') nroNotasPedidoTotalTemplate: TemplateRef<any>;
  // @ViewChild('ordenesTemplate') ordenesTemplate: TemplateRef<any>;
  @ViewChild('expandRowTemplate') expandRowTemplate: TemplateRef<any>;

  actionConfig: ActionConfig;
  actionsText: string = '';
  allRows: any[];
  columns: any[];
  currentSortField: SortField;
  emptyStateConfig: EmptyStateConfig;
  filterConfig: FilterConfig;
  filteredRows: any[];
  filtersText: string = '';
  isAscendingSort: boolean = true;
  paginationConfig: PaginationConfig;
  rows: any[];
  rowsAvailable: boolean = true;
  separator: Object;
  sortConfig: SortConfig;
  tableConfig: TableConfig;
  toolbarConfig: ToolbarConfig;

  //variables
  loading = false;
  expedients: any[] = [];
  idExpedienteSeleccionado: any;

  //datePicker
  // datePickerConfig: Partial<BsDatepickerConfig>;

  bsValuei: Date = new Date();
  bsValuef: Date = new Date();

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

  constructor(private dataService: DataService, private notification : ToastsManager, private viewContainerRef: ViewContainerRef) {
    // setTheme('bs3');
    // this.datePickerConfig = Object.assign({},
    //   { containerClass: 'theme-dark-blue' });

      this.notification.setRootViewContainerRef(viewContainerRef);
  }


  ngOnInit(): void {
    this.columns = [
      {
      cellTemplate: this.productoTemplate,
      draggable: true,
      prop: 'textoCodigoProdDenominacion',
      name: 'Producto',
      resizeable: true
    }, {
      cellTemplate: this.uMedTemplate,
      draggable: true,
      prop: 'textUnidadMedida',
      name: 'U.Med',
      resizeable: true
    }, {
      cellTemplate: this.cantpedTemplate,
      draggable: true,
      prop: 'Cantidad',
      name: 'Cant.Pedida',
      resizeable: true
    }, {
      cellTemplate: this.compradoTemplate,
      draggable: true,
      prop: 'CantidadOrden',
      name: 'Comprado',
      resizeable: true
    }, {
      cellTemplate: this.parcialTemplate,
      draggable: true,
      prop: 'Parcial',
      name: 'Parcial',
      resizeable: true
    }, {
      cellTemplate: this.notaSalidaTemplate,
      draggable: true,
      prop: 'CantidadNotaSalida',
      name: 'Nota Salida',
      resizeable: true
    }, {
      cellTemplate: this.saldoTemplate,
      draggable: true,
      prop: 'Saldo',
      name: 'Saldo',
      resizeable: true
    }, {
      cellTemplate: this.centroCostoTemplate,
      draggable: true,
      prop: 'Observacion',
      name: 'CentroCosto',
      resizeable: true
    }, {
      cellTemplate: this.nroNotasPedidoTemplate,
      draggable: true,
      prop: 'NroNotaPedido',
      name: 'Nro Notas Pedido',
      resizeable: true
    }
    // , {
    //   cellTemplate: this.nroNotasPedidoTotalTemplate,
    //   draggable: true,
    //   prop: 'CodigoS10Text',
    //   name: 'Nro Notas Pedido Total',
    //   resizeable: true
    // }, {
    //   cellTemplate: this.ordenesTemplate,
    //   draggable: true,
    //   prop: 'NroModifica',
    //   name: 'Ordenes',
    //   resizeable: true
    // }
    ];

    this.allRows = [];
    this.filteredRows = this.allRows;

    this.paginationConfig = {
      pageNumber: 1,
      pageSize: 10,
      // pageSizeIncrements: [2, 3, 4],
      totalItems: this.filteredRows.length
    } as PaginationConfig;

    // Need to initialize for results/total counts
    this.updateRows();

    this.filterConfig = {
      fields: [{
        id: 'textoCodigoProdDenominacion',
        title: 'Producto',
        placeholder: 'filtro por denominacion de producto...',
        type: FilterType.TEXT
      }] as FilterField[],
      appliedFilters: [],
      resultsCount: this.rows.length,
      totalCount: this.allRows.length
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'textoCodigoProdDenominacion',
        title: 'Producto',
        sortType: 'alpha'
      }
      ],
      isAscending: this.isAscendingSort
    } as SortConfig;

    this.emptyStateConfig = {
      iconStyleClass: 'pficon-warning-triangle-o',
      title: 'Ningún Producto',
      info: 'Seleccione un centro de costo y luego pulse en el boton Consultar',
    } as EmptyStateConfig;

    this.toolbarConfig = {
      actionConfig: this.actionConfig,
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

    this.tableConfig = {
      emptyStateConfig: this.emptyStateConfig,
      paginationConfig: this.paginationConfig,
      showCheckbox: true,
      useExpandRows: true      
    } as TableConfig;

    this.loadExpedients();
  }

  // Filter

  applyFilters(filters: Filter[]): void {
   this.tableConfig.paginationConfig.pageNumber=1;
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
    this.tableConfig.appliedFilters = filters; 
    this.toolbarConfig.filterConfig.resultsCount = this.filteredRows.length;
    this.updateRows();
  }

  // Handle filter changes
  filterChanged($event: FilterEvent): void {
    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
    });
    this.applyFilters($event.appliedFilters);
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

  // Pagination
  handlePageSize($event: PaginationEvent): void {
    this.actionsText = 'Page Size: ' + $event.pageSize + ' Selected' + '\n' + this.actionsText;
    this.updateRows();
  }

  handlePageNumber($event: PaginationEvent): void {
    this.actionsText = 'Page Number: ' + $event.pageNumber + ' Selected' + '\n' + this.actionsText;
    this.updateRows();
  }

  updateRows(): void {
    this.paginationConfig.totalItems = this.filteredRows.length;
    this.rows = this.filteredRows.slice((this.paginationConfig.pageNumber - 1) * this.paginationConfig.pageSize,
    this.paginationConfig.totalItems).slice(0, this.paginationConfig.pageSize);
  }

  // Sort
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

  // Handle sort changes
  handleSortChanged($event: SortEvent): void { 
    console.log("change alf" , $event);
    
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.allRows.sort((item1: any, item2: any) => this.compare(item1, item2));
    this.applyFilters(this.filterConfig.appliedFilters || []);
  }

  // View
  viewSelected(currentView: ToolbarView): void {
    this.sortConfig.visible = (currentView.id === 'tableView' ? false : true);
  }

  // Selection
  handleSelectionChange($event: TableEvent): void {
    this.totalCantidadPedida = 0;
    this.totalComprado = 0;
    this.totalParcial = 0;
    this.totalNotaSalida = 0;
    this.totalSaldo = 0;

    this.actionsText = $event.selectedRows.length + ' rows selected\r\n' + this.actionsText;
    this.toolbarConfig.filterConfig.selectedCount = $event.selectedRows.length;
    if ($event.selectedRows.length) {
        $event.selectedRows.forEach(row => {
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

  updateItemsAvailable(): void {
    if (this.rowsAvailable) {
      this.toolbarConfig.disabled = false;
      this.toolbarConfig.filterConfig.totalCount = this.allRows.length;
      this.filteredRows = this.allRows;
      this.updateRows();
    } else {
      // Clear previously applied properties to simulate no rows available
      this.toolbarConfig.disabled = true;
      this.toolbarConfig.filterConfig.totalCount = 0;
      this.filterConfig.appliedFilters = [];
      this.rows = [];
    }
  }

  loadExpedients() {
    this.loading = true;
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => { this.expedients = data; this.loading = false; });
  }

  consultar() {
    // console.log("inicio de servicio");
    if(this.idExpedienteSeleccionado){
      const queryParams: URLSearchParams = new URLSearchParams();
      queryParams.set('idProyecto', this.idExpedienteSeleccionado);
      queryParams.set('mayor', "");
      queryParams.set('fechaIni', "");
      queryParams.set('fechaFin', "");
      this.dataService.requeriments().getAllSaldo(queryParams).subscribe((data: any[]) => {        
        this.allRows = data;
        this.rows = data;
        this.filteredRows = this.rows;
        this.tableConfig.paginationConfig.totalItems = data.length;
        this.filterConfig.resultsCount = data.length;
        this.filterConfig.totalCount = data.length;
        this.tableConfig.paginationConfig.pageSize = 10;
        this.updateRows();
        this.totalGeneral();
        // this.tableConfig.showCheckbox = true;
        // let even = new SortEvent();
        // even.field={
        // id : "textoCodigoProdDenominacion",
        // sortType :"alpha",
        // title :"Producto",
        // };
        //  even.isAscending = false;
        // this.handleSortChanged(even);
      });
    }else{
      this.notification.warning('Seleccione un centro de costo ', 'Informacion');
    }
  }

  cambio() {
    this.toolbarConfig.disabled = false;
    this.toolbarConfig.filterConfig.totalCount = 0;
    this.filterConfig.appliedFilters = [];
    this.rows = [];
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

}
