import { OrderBy } from './../../../core/model/order-by.model';
import { SearchCriteriaFilter } from './../../../core/model/search-criteria-filter.model';
import { Paging } from './../../../core/model/paging.model';
import { SearchCriteria } from './../../../core/model/search-criteria.model';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { ToastsManager } from 'ng6-toastr';

import { Expedient } from './../../../core/model/expedient.model';
import { DataService } from '../../../core/data/data.service';

import { ActionConfig, Action } from 'patternfly-ng/action';
import { FilterConfig, FilterField, FilterType, FilterEvent, Filter } from 'patternfly-ng/filter';
import { SortConfig, SortField, SortEvent } from 'patternfly-ng/sort';
import { ToolbarConfig, ToolbarView } from 'patternfly-ng/toolbar';
import { SearchResults } from '../../../core/model/search-results.model';
import { PaginationConfig, PaginationEvent } from 'patternfly-ng/pagination';



@Component({
  selector: 'sacpi-center-coste',
  templateUrl: './center-coste.component.html',
  styleUrls: ['./center-coste.component.scss']
})
export class CenterCosteComponent implements OnInit {

  filterConfig: FilterConfig;
  filtersText: string = '';
  isAscendingSort: boolean = true;
  sortConfig: SortConfig;
  currentSortField: SortField;
  toolbarConfig: ToolbarConfig;
  paginationConfig: PaginationConfig;

  loading = false;
  searchResult: SearchResults<Expedient> = new SearchResults<Expedient>();
  expedients: Array<Expedient> = new Array<Expedient>();
  expedient: Expedient;

  filters: Array<SearchCriteriaFilter> = new Array<SearchCriteriaFilter>();
  orderBy: OrderBy = {
    name: 'Alias',
    ascending: false
  };
  paging: Paging = {
    page: 1,
    pageSize: 8
  };

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private notification: ToastsManager,
    private viewContainerRef: ViewContainerRef
  ) {
    this.notification.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit() {
    this.loadtoolbar();
    this.search();
  }

  loadtoolbar() {
    this.filterConfig = {
      fields: [{
        id: 'Alias',
        title: 'Centro Costo',
        placeholder: 'Buscar por Centro Costo...',
        type: FilterType.TEXT
      }] as FilterField[],
      resultsCount: this.searchResult.totalSize,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'Alias',
        title: 'Centro Costo',
        sortType: 'alpha'
      }, {
        id: 'NumberRequirement',
        title: 'Cantidad Requerimiento',
        sortType: 'alpha'
      }, {
        id: 'CreatedTime',
        title: 'Fecha Creacion',
        sortType: 'alpha'
      }],
      isAscending: this.isAscendingSort
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
    this.paginationConfig = {
      pageSize: 8,
      pageNumber: 1,
      totalItems: this.searchResult.totalSize
    } as PaginationConfig;
  }

  // Filter
  filterChanged($event: FilterEvent): void {
    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
    });
    this.applyFilters($event.appliedFilters);
  }

  applyFilters(filters: Filter[]): void {
    this.filters = new Array<SearchCriteriaFilter>();
    if (filters && filters.length > 0) {
      filters.forEach((filter) => {
        this.filters.push(new SearchCriteriaFilter(filter.field.id, filter.value, 'like', filter.field.type));
      });
    }
    this.search();
  }
  // Sort
  sortChanged($event: SortEvent): void {
    this.orderBy.name = $event.field.id;
    this.orderBy.ascending = $event.isAscending;
    this.search();
  }

  // View
  viewSelected(currentView: ToolbarView): void {
    this.sortConfig.visible = (currentView.id === 'tableView' ? false : true);
  }

  handlePageSize($event: PaginationEvent) {
    this.paging.pageSize = $event.pageSize;
    this.search();
  }

  handlePageNumber($event: PaginationEvent) {
    this.paging.page = $event.pageNumber;
    this.search();
  }

  search() {
    this.loading = true;
    let id = this.dataService.users().getEmployeeId();
    const criteria: SearchCriteria = {
      id: id,
      filters: this.filters.map(f => {
        return new SearchCriteriaFilter(f.name, f.value, f.operator, f.type);
      }),
      orders: [this.orderBy],
      paging: this.paging
    };
    this.dataService.expedients().search(criteria).subscribe((data) => {    
      this.searchResult = data;
      this.expedients = this.searchResult.items;
      this.toolbarConfig.filterConfig.resultsCount = this.searchResult.totalSize;
      this.paginationConfig.totalItems = this.searchResult.totalSize;
    },
      error => {
        this.notification.error('Error al obtener expedientes, usuario no tiene asigando ningun expediente.', 'Error');
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
  }

  viewDetailExpediente(expedient: Expedient): void {
  }

  viewRequerimiento(expedient: Expedient) {
  }
}
