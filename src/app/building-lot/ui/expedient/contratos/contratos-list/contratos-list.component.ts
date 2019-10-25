import { Paging } from './../../../../../core/model/paging.model';
import { OrderBy } from './../../../../../core/model/order-by.model';
import { ListConfig } from 'patternfly-ng/list';
import { DataService } from './../../../../../core/data/data.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, TemplateRef } from '@angular/core';
import { ToastsManager } from 'ng6-toastr';
import { URLSearchParams } from '@angular/http';

//for toolbar
import { Action, ActionConfig } from 'patternfly-ng/action';
import { Filter, FilterConfig, FilterField, FilterEvent, FilterType } from 'patternfly-ng/filter';
import { SortConfig, SortField, SortEvent } from 'patternfly-ng/sort';
import { ToolbarConfig, ToolbarView } from 'patternfly-ng/toolbar';

//for pagination
import { PaginationConfig, PaginationEvent } from 'patternfly-ng/pagination';

//for list
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { SearchCriteria } from '../../../../../core/model/search-criteria.model';
import { Requirement } from '../../../../../core/model/requirement.model';
import { SearchResults } from '../../../../../core/model/search-results.model';
import { SearchCriteriaFilter } from '../../../../../core/model/search-criteria-filter.model';

@Component({
  selector: 'sacpi-contratos-list',
  templateUrl: './contratos-list.component.html',
  styleUrls: ['./contratos-list.component.scss']
})
export class ContratosListComponent implements OnInit {
  requirements: Array<Requirement> = new Array<Requirement>();//eliminar 
  filtersText: string = '';
  expedients: any[] = [];
  contratos: any[] = [];
  loading = false;
  filterConfig: FilterConfig;
  requirementType: any[] = [];
  sortConfig: SortConfig;
  toolbarConfig: ToolbarConfig;
  listConfig: ListConfig;
  paginationConfig: PaginationConfig;
  emptyStateConfig: EmptyStateConfig;
  centroCostoId : any;

  searchResult: SearchResults<any> = new SearchResults<any>();
  //searchResult: SearchResults<Requirement> = new SearchResults<Requirement>();
  filters: Array<SearchCriteriaFilter> = new Array<SearchCriteriaFilter>();
  orderBy: OrderBy = {
    name: 'CodigoContrato',
    ascending: false
  };
  paging: Paging = {
    page: 1,
    pageSize: 5
  };

  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private dataService: DataService,
    private toastr: ToastsManager) { }

  ngOnInit() {
    this.inittoolbar();
    this.loadExpedients();

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: true,
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;

    this.paginationConfig = {
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.page,
      totalItems: this.searchResult.totalSize
    } as PaginationConfig;
  }

  inittoolbar() {
    this.filterConfig = {
      fields: [{
        id: 'CodigoContrato',
        title: 'Codigo Contrato',
        placeholder: 'Filter por codigo de Contrato...',
        type: FilterType.TEXT
      },{
        id: 'TipoContrato',
        title: 'Tipo Contrato',
        placeholder: 'Filter by Tipo Contrato...',
        type: FilterType.TEXT
      }, {
        id: 'Proveedor',
        title: 'Proveedor',
        placeholder: 'Filtrar por Proveedor...',
        type: FilterType.TEXT
        //queries: this.expedients
      }     
    ] as FilterField[],
      // resultsCount: this.searchResult.totalSize,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'CodigoContrato',
        title: 'Codigo Contrato',
        sortType: 'alpha'
      }, {
        id:'TipoContrato',
        title: 'Tipo Contrato',
        sortType: 'alpha'
      },{
        id: 'Proveedor',
        title: 'Proveedor',
        sortType: 'alpha'
      }
    ],
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
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => { this.expedients = data; this.loading = false; });
  }

  loadContratos(){
    let idExpediente = this.centroCostoId;

    let id = idExpediente;
    const criteria: SearchCriteria = {
      id: id,
      filters: this.filters.map(f => {
        return new SearchCriteriaFilter(f.name, f.value, f.operator, f.type);
      }),
      orders: [this.orderBy],
      paging: this.paging
    };  

    // const queryParams: URLSearchParams = new URLSearchParams();
    // queryParams.set('idCentroCosto', idExpediente);
    this.dataService.expedients().getAllContracts(criteria).subscribe((d:any)=>{
      this.searchResult = d;
      this.contratos = d.data;
      //this.contratos = data.data;
      this.toolbarConfig.filterConfig.resultsCount = d.count;
      this.paginationConfig.totalItems = d.count;
     
    });
    // this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => { this.expedients = data; this.loading = false; });
  }

   //for pagination
   handlePageSize($event: PaginationEvent) {
    this.paging.pageSize = $event.pageSize;
    this.loadContratos();
  }

  handlePageNumber($event: PaginationEvent) {
    this.paging.page = $event.pageNumber;
    this.loadContratos();
  }

  sortChanged($event: SortEvent): void {
    console.log("sortChanged "+$event);
    this.orderBy.name = $event.field.id;
    this.orderBy.ascending = $event.isAscending;
    this.loadContratos();
  }

  // search(): void {
  //   let id = this.dataService.users().getEmployeeId();
  //   const criteria: SearchCriteria = {
  //     id: id,
  //     filters: this.filters.map(f => {
  //       return new SearchCriteriaFilter(f.name, f.value, f.operator, f.type);
  //     }),
  //     orders: [this.orderBy],
  //     paging: this.paging
  //   };
  //   this.loading = true;
  //   this.dataService.requeriments().searchService(criteria).subscribe((data) => {
  //     this.searchResult = data;
  //     this.requirements = this.searchResult.items;
  //     this.toolbarConfig.filterConfig.resultsCount = this.searchResult.totalSize;
  //     this.paginationConfig.totalItems = this.searchResult.totalSize;
  //   },
  //     error => {
  //       this.toastr.error('Ocurrieron problema para mostrar el requerimiento de Servicio', 'Error');
  //       this.loading = false;
  //     },
  //     () => {
  //       this.loading = false;
  //     });
  // }

   // View
   viewSelected(currentView: ToolbarView): void {
     console.log("vlaor de currency " +JSON.stringify(currentView));
    this.sortConfig.visible = (currentView.id === 'tableView' ? false : true);
  }

  filterChanged($event: FilterEvent): void {
    console.log("filterChanged "+ JSON.stringify($event));
    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
    });
    this.applyFilters($event.appliedFilters);
  }

  applyFilters(filters: Filter[]): void {
    console.log("applyFilters "+JSON.stringify(filters));
    this.filters = new Array<SearchCriteriaFilter>();
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        if (filter.field.type === 'text') {
          this.filters.push(new SearchCriteriaFilter(filter.field.id, filter.value, 'like', filter.field.type));
        }
        if (filter.field.type === 'select') {
          this.filters.push(new SearchCriteriaFilter(filter.field.id, filter.query.id, 'eq'));
        }
      });
    }
    this.loadContratos();
  }

}
