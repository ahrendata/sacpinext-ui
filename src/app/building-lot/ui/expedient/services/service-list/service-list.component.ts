import { BsModalService } from 'ngx-bootstrap/modal';
import { DataService } from './../../../../../core/data/data.service';
import { Component, OnInit, ViewContainerRef, TemplateRef , ViewEncapsulation} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

//for toolbar
import { Action, ActionConfig } from 'patternfly-ng/action';
import { Filter, FilterConfig, FilterField, FilterEvent, FilterType } from 'patternfly-ng/filter';
import { SortConfig, SortField, SortEvent } from 'patternfly-ng/sort';
import { ToolbarConfig, ToolbarView } from 'patternfly-ng/toolbar';

//for list
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { ListEvent, ListConfig } from 'patternfly-ng/list';

//for pagination
import { PaginationConfig, PaginationEvent } from 'patternfly-ng/pagination';

import { OrderBy } from '../../../../../core/model/order-by.model';
import { Paging } from '../../../../../core/model/paging.model';


import { Requirement } from '../../../../../core/model/requirement.model';
import { SearchResults } from '../../../../../core/model/search-results.model';
import { SearchCriteriaFilter } from '../../../../../core/model/search-criteria-filter.model';
import { ToastsManager } from 'ng6-toastr';

import { SearchCriteria } from '../../../../../core/model/search-criteria.model';

import { ConfirmationModalComponent } from '../../../../../shared/components/confirmation-modal/confirmation-modal.component';

import { URLSearchParams } from '@angular/http';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'sacpi-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent implements OnInit {


  filterConfig: FilterConfig;
  filtersText: string = '';
  sortConfig: SortConfig;
  toolbarConfig: ToolbarConfig;
  loading = false;
  emptyStateConfig: EmptyStateConfig;
  listConfig: ListConfig;
  paginationConfig: PaginationConfig;

  expedients: any[] = [];
  requirementType: any[] = [];

   requirements: Array<Requirement> = new Array<Requirement>();
   searchResult: SearchResults<Requirement> = new SearchResults<Requirement>();

   filters: Array<SearchCriteriaFilter> = new Array<SearchCriteriaFilter>();

  orderBy: OrderBy = {
    name: 'IdRequirement',
    ascending: false
  };
  paging: Paging = {
    page: 1,
    pageSize: 5
  };

  constructor(
    private router: Router,
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
        id: 'Description',
        title: 'Descripcion',
        placeholder: 'Filter por descripcion del requerimiento...',
        type: FilterType.TEXT
      },{
        id: 'CodRequirement',
        title: 'N° Requerimiento',
        placeholder: 'Filter by N° Requerimiento...',
        type: FilterType.TEXT
      }, {
        id: 'IdExpedient',
        title: 'Centro de costo',
        placeholder: 'Filtrar por Centro de costo...',
        type: FilterType.SELECT,
        queries: this.expedients
      }, {
        id: 'IdTypeRequirement',
        title: 'Tipo Requerimiento',
        placeholder: 'Filtrar por tipo de requerimiento...',
        type: FilterType.SELECT,
        queries: this.requirementType
      }] as FilterField[],
      // resultsCount: this.searchResult.totalSize,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'IdRequirement',
        title: 'N° Requerimiento',
        sortType: 'alpha'
      }, {
        id:'Description',
        title: 'Descripción',
        sortType: 'alpha'
      },{
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
      }
      //  {
      //   id: 'PercentBought',
      //   title: '% Comprado',
      //   sortType: 'alpha'
      // }, {
      //   id: 'PercentSend',
      //   title: '% Enviado',
      //   sortType: 'alpha'
      // }
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
    this.search();
  }


  sortChanged($event: SortEvent): void {
    this.orderBy.name = $event.field.id;
    this.orderBy.ascending = $event.isAscending;
    this.search();
  }

  search(): void {
    let id = this.dataService.users().getEmployeeId();
    const criteria: SearchCriteria = {
      id: id,
      filters: this.filters.map(f => {
        return new SearchCriteriaFilter(f.name, f.value, f.operator, f.type);
      }),
      orders: [this.orderBy],
      paging: this.paging
    };
    this.loading = true;
    this.dataService.requeriments().searchService(criteria).subscribe((data) => {
      this.searchResult = data;
      this.requirements = this.searchResult.items;
      this.toolbarConfig.filterConfig.resultsCount = this.searchResult.totalSize;
      this.paginationConfig.totalItems = this.searchResult.totalSize;
    },
      error => {
        this.toastr.error('Ocurrieron problema para mostrar el requerimiento de Servicio', 'Error');
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
  }

  nuevo() {
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute });
  }


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
            queryParams.set('id', item.IdRequirement);
            queryParams.set('idUser', iduser);
            this.dataService.requeriments().delete(queryParams).subscribe(
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
    this.search();
  }

  handlePageNumber($event: PaginationEvent) {
    this.paging.page = $event.pageNumber;
    this.search();
  }

}
