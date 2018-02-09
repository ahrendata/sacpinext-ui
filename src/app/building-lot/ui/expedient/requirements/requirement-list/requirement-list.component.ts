import { Component, OnInit, ViewContainerRef, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { Requirement } from '../../../../../core/model/requirement.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../core/data/data.service';
import { ToastsManager } from 'ng2-toastr';
import { URLSearchParams } from '@angular/http';

//for toolbar
import { Action } from 'patternfly-ng/action/action';
import { ActionConfig } from 'patternfly-ng/action/action-config';
import { Filter } from 'patternfly-ng/filter/filter';
import { FilterConfig } from 'patternfly-ng/filter/filter-config';
import { FilterField } from 'patternfly-ng/filter/filter-field';
import { FilterEvent } from 'patternfly-ng/filter/filter-event';
import { FilterType } from 'patternfly-ng/filter/filter-type';
import { SortConfig } from 'patternfly-ng/sort/sort-config';
import { SortField } from 'patternfly-ng/sort/sort-field';
import { SortEvent } from 'patternfly-ng/sort/sort-event';
import { ToolbarConfig } from 'patternfly-ng/toolbar/toolbar-config';
import { ToolbarView } from 'patternfly-ng/toolbar/toolbar-view';

//for list
import { EmptyStateConfig } from 'patternfly-ng/empty-state/empty-state-config';
import { ListEvent } from 'patternfly-ng/list/list-event';
import { ListConfig } from 'patternfly-ng/list/basic-list//list-config';
import { cloneDeep } from 'lodash';

//for pagiysntion
import { PaginationConfig } from 'patternfly-ng/pagination/pagination-config';
import { PaginationEvent } from 'patternfly-ng/pagination/pagination-event';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap';
import { ConfirmationModalComponent } from '../../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { SearchResults } from '../../../../../core/model/search-results.model';
import { SearchCriteriaFilter } from '../../../../../core/model/search-criteria-filter.model';
import { OrderBy } from '../../../../../core/model/order-by.model';
import { Paging } from '../../../../../core/model/paging.model';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'sacpi-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss']
})

export class RequirementListComponent implements OnInit {
  actionConfig: ActionConfig;
  actionsText: string = '';
  filterConfig: FilterConfig;
  filtersText: string = '';
  items: any[];
  isAscendingSort: boolean = true;
  separator: Object;
  sortConfig: SortConfig;
  currentSortField: SortField;
  toolbarConfig: ToolbarConfig;
  weekDayQueries: any[];

  //for list
  actionsText1: string = '';
  emptyStateConfig: EmptyStateConfig;
  itemsAvailable: boolean = true;
  listConfig: ListConfig;
  selectType: string = 'checkbox';

  //for pag
  paginationConfig: PaginationConfig;

  total = 0;
  page = 1;
  limit = 5;

  loading = false;
  requirements: any[] = [];
  expedients: any[] = [];
  requirementType: any[] = [];



  searchResult: SearchResults<Requirement> = new SearchResults<Requirement>();
  filters: Array<SearchCriteriaFilter> = new Array<SearchCriteriaFilter>();
  orderBy: OrderBy = {
    name: 'Alias',
    ascending: false
  };
  paging: Paging = {
    page: 1,
    pageSize: 8
  };

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastsManager,
    private bsModalService: BsModalService,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.loadExpediente();
    this.loadRequirementType();
    this.inittoolbar();
    this.search();

    this.actionConfig = {
      primaryActions: [{
        id: 'NUEVO',
        title: 'Nuevo',
        tooltip: 'Generar nuevo requerimiento',
        styleClass: 'btn-primary'
      }]
    } as ActionConfig;

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
      multiSelect: false,
      selectItems: false,
      selectionMatchProp: 'name',
      showCheckbox: false,
      useExpandItems: false
    } as ListConfig;

    this.paginationConfig = {
      pageSize: 10,
      pageNumber: 1,
      totalItems: this.requirements.length
    } as PaginationConfig;
  }

  loadRequirementType() {
    this.dataService.requerimenttype().getAll().subscribe((data: any[]) => {
      data.forEach(item => {
        this.requirementType.push({ id: item.IdContenedor, value: item.Descryption });
      });
    });
  }
  loadExpediente() {
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => {
      data.forEach(item => {
        this.expedients.push({ id: item.IdExpediente, value: item.Alias });
      });
    });
  }

  inittoolbar() {
    this.filterConfig = {
      fields: [{
        id: 'CodRequirement',
        title: 'N° Requerimiento',
        placeholder: 'Filter by N° Requerimiento...',
        type: FilterType.TEXT
      }, {
        id: 'IdExpediente',
        title: 'Centro de costo',
        placeholder: 'Filtrar por Centro de costo...',
        type: FilterType.SELECT,
        queries: this.expedients
      }, {
        id: 'TypeRequirement',
        title: 'Tipo Requerimiento',
        placeholder: 'Filtrar por tipo de requerimiento...',
        type: FilterType.SELECT,
        queries: this.requirementType
      }] as FilterField[],
      resultsCount: 0,// this.items.length,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'CodRequirement',
        title: 'N° Requerimiento',
        sortType: 'alpha'
      }, {
        id: 'AliasExpedient',
        title: 'Centro de Costo',
        sortType: 'alpha'
      }, {
        id: 'TypeRequirement',
        title: 'Tipo Requerimiento',
        sortType: 'alpha'
      }, {
        id: 'AtentionDate',
        title: 'Fecha Atencion',
        sortType: 'alpha'
      }, {
        id: 'CreateDate',
        title: 'Fecha Creacion',
        sortType: 'alpha'
      }, {
        id: 'PercentBought',
        title: '% Comprado',
        sortType: 'alpha'
      }, {
        id: 'PercentSend',
        title: '% Enviado',
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
        if (filter.field.type === 'text') {
          this.filters.push(new SearchCriteriaFilter(filter.field.id, filter.value, 'like', filter.field.type));
        }
        if (filter.field.type === 'select') {
          this.filters.push(new SearchCriteriaFilter(filter.field.id, filter.query.id, 'eq'));
        }
      });
    }
    console.log(this.filters)
    this.search();
  }

  sortChanged($event: SortEvent): void {
    this.orderBy.name = $event.field.id;
    this.orderBy.ascending = $event.isAscending;
    this.search();
  }


  search(): void {
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    queryParams.set('pageNumber', this.page.toString());
    queryParams.set('PageSize', this.limit.toString());
    this.loading = true;
    this.dataService.requeriments().getAll(queryParams).subscribe((data: any) => {
      this.requirements = cloneDeep(data.data);// data.data;
      this.paginationConfig.totalItems = data.count;// this.requirements.length;
      this.paginationConfig.pageSize = this.limit;
      this.toolbarConfig.filterConfig.resultsCount = data.count;
    },
      error => {
        this.toastr.error('Ocurrieron problema para mostrar el requerimiento', 'Error');
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
  }


  nuevo() {
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute });
  }

  //button editar requerimimiento.
  handleActionGrid(action: Action, item: any): void {
    if (action.title == "Confirmar") {
      if (item.Status) {
        this.toastr.warning('Este requerimiento ya esta confirmnado..', 'Alerta');
      }
      else {
        let iduser: any = this.dataService.users().getUserId();
        const queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set('idRequeriment', item.IdRequirement);
        queryParams.set('idUser', iduser);
        console.log("Confirmando el requerimiento");
        this.dataService.requeriments().confirmar(queryParams).subscribe(
          response => {
            this.router.navigate(['../'], { relativeTo: this.activatedRoute });
            this.search();
          },
          error => {
            this.toastr.error('Ocurrio un error al confirmar este requerimiento, intentelo nuevamente.', 'Error');
          }
        );
      }
    }
    else if (action.title == "Eliminar") {
      if (item.StatusDelete) {
        let modal = this.bsModalService.show(ConfirmationModalComponent, { keyboard: false, backdrop: 'static' });
        (<ConfirmationModalComponent>modal.content).showConfirmationModal(
          'Estas Seguro de Eliminar el requerimiento N° ',
          item.CodRequirement
        );
        (<ConfirmationModalComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            let iduser: any = this.dataService.users().getUserId();
            const queryParams: URLSearchParams = new URLSearchParams();
            queryParams.set('idUser', iduser);
            console.log("Confirmando el requerimiento");
            this.dataService.requeriments().delete(item.IdRequirement, queryParams).subscribe(
              response => {
                this.toastr.success('El requerimiento fue eliminado correctamente.', 'Informacion');
                this.search();
              },
              error => {
                this.toastr.error('Ocurrio un error al eliminar este requerimiento, intentelo nuevamente.', 'Error');
              }
            );
          }
        });
      } else {
        this.toastr.warning('El requerimiento no se puede eliminar, ya se hicieron la compra de algunos productos.', 'Alerta');//
      }
    }
    else if (action.title == "Ver")
      this.router.navigate(['./view', item.IdRequirement], { relativeTo: this.activatedRoute });
    else {
      if (item.StatusEdit) {
        this.router.navigate(['./', item.IdRequirement], { relativeTo: this.activatedRoute });
      } else {
        this.toastr.warning('El requerimiento no se puede editar, las fechas no coincidden. Solo se pueden editar requerimientos generados el mismo dia.', 'Alerta');//
      }
    }
  }




  // View
  viewSelected(currentView: ToolbarView): void {
    this.sortConfig.visible = (currentView.id === 'tableView' ? false : true);
  }

  getActionConfig(item: any, actionButtonTemplate: TemplateRef<any>): ActionConfig {
    let actionConfig = {
      primaryActions: [
        {
          id: 'Editar',
          title: 'Editar',
          tooltip: 'Editar Requerimiento',
          template: actionButtonTemplate
        }],
      moreActions: [{
        id: 'Print',
        title: 'Ver',
        tooltip: 'Ver Requerimiento'
      }, {
        id: 'Confirm',
        title: 'Confirmar',
        tooltip: 'Confirmar Requerimiento'
      }, {
        id: 'Delete',
        title: 'Eliminar',
        tooltip: 'Eliminar Requerimiento'
      }],
      moreActionsDisabled: false,
      moreActionsVisible: true
    } as ActionConfig;
    let confirm: boolean = item.Status;
    let del: boolean = item.StatusDelete;
    let edit: boolean = item.StatusEdit;
    if (!confirm) {
      actionConfig.moreActionsStyleClass = 'red';
      actionConfig.primaryActions[0].styleClass = 'red';
    } else {
      actionConfig.moreActions[1].visible = false;
    }
    if (!edit) {
      actionConfig.primaryActions[0].visible = false;
    }
    if (!del) {
      actionConfig.moreActions[2].visible = false;
    }
    return actionConfig;
  }

  //for pagination
  handlePageSize($event: PaginationEvent) {
    this.paging.pageSize = $event.pageSize;
    this.limit = $event.pageSize;
    this.search();
  }

  handlePageNumber($event: PaginationEvent) {
    this.paging.page = $event.pageNumber;
    this.page = $event.pageNumber;
    //this.limit = 5;
    this.search();
  }
}
