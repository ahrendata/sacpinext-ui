import { Component, OnInit, ViewContainerRef, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { Requirement } from '../../../../../core/model/requirement.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../core/data/data.service';
import { ToastsManager } from 'ng6-toastr';
import { URLSearchParams } from '@angular/http';

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

// UI
import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent } from '../../../../../shared/components/confirmation-modal/confirmation-modal.component';
import { SearchResults } from '../../../../../core/model/search-results.model';
import { SearchCriteriaFilter } from '../../../../../core/model/search-criteria-filter.model';
import { OrderBy } from '../../../../../core/model/order-by.model';
import { Paging } from '../../../../../core/model/paging.model';
import { SearchCriteria } from '../../../../../core/model/search-criteria.model';
import { TokenService } from '../../../../../core/guard/token.service';

@Component({
  selector: 'sacpi-registry-list',
  templateUrl: './registry-list.component.html',
  styleUrls: ['./registry-list.component.scss']
})
export class RegistryListComponent implements OnInit {

  // Toolbar
  filterConfig: FilterConfig;
  filtersText: string = '';
  sortConfig: SortConfig;
  toolbarConfig: ToolbarConfig;
  loading = false;
  emptyStateConfig: EmptyStateConfig;
  listConfig: ListConfig;
  paginationConfig: PaginationConfig;
  paging: Paging = {
    page: 1,
    pageSize: 5
  };
  orderBy: OrderBy = {
    name: 'idRegistroSctr',
    ascending: false
  };

  expedients: any[] = [];
  requirementType: any[] = [];

  //requirements: Array<Requirement> = new Array<Requirement>();
  //searchResul1t: SearchResults<Requirement> = new SearchResults<Requirement>();
  searchResult: SearchResults<any> = new SearchResults<any>();

  filters: Array<SearchCriteriaFilter> = new Array<SearchCriteriaFilter>();

  // Data
  sctrList: any[] = [];


  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastsManager,
    private bsModalService: BsModalService,
    vcr: ViewContainerRef,
    private token: TokenService) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {

    let criteriaPaging = this.token.getPagingCriteriaReq();    //console.log(JSON.stringify(criteriaPaging));
    if (criteriaPaging)
      this.paging = criteriaPaging as Paging;

    // Load Toolbar
    this.inittoolbar();

    // Init Table Config
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

    // Call Search first time
    this.search();

  }

  // Create
  nuevo() {
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute });
  }

  // Toolbar
  inittoolbar() {
    this.filterConfig = {
      fields: [{
        id: 'denominacion',
        title: 'Denominación',
        placeholder: 'Filter por descripcion del SCTR...',
        type: FilterType.TEXT
      }, {
        id: 'IdExpedient',
        title: 'Centro de costo',
        placeholder: 'Filtrar por Centro de Costo...',
        type: FilterType.SELECT,
        queries: this.expedients
      }
      ] as FilterField[],
      resultsCount: this.searchResult.totalSize,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [
        // {
        //   id: 'idRegistroSctr',
        //   title: 'N° Registro SCTR',
        //   sortType: 'alpha'
        // },
        {
          id: 'denominacion',
          title: 'Descripción',
          sortType: 'alpha'
        },
        {
          id: 'expediente',
          title: 'Centro de Costo',
          sortType: 'alpha'
        },
        // {
        //   id: 'TypeRequirement',
        //   title: 'Tipo Requerimiento',
        //   sortType: 'alpha'
        // },
        // {
        //   id: 'AtentionDate',
        //   title: 'Fecha Atencion',
        //   sortType: 'alpha'
        // },
        {
          id: 'fechaCreacion',
          title: 'Fecha Creacion',
          sortType: 'alpha'
        },
        // {
        //   id: 'PercentBought',
        //   title: '% Comprado',
        //   sortType: 'alpha'
        // },
        // {
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

  // View
  viewSelected(currentView: ToolbarView): void {
    this.sortConfig.visible = (currentView.id === 'tableView' ? false : true);
  }
  // Table Actions
  getActionConfig(item: any, actionButtonTemplate: TemplateRef<any>): ActionConfig {
    let actionConfig = {
      primaryActions: [
        {
          id: 'Editar',
          title: 'Editar',
          tooltip: 'Editar SCTR',
          template: actionButtonTemplate
        }],
      moreActions: [
        // {
        //   id: 'Print',
        //   title: 'Ver',
        //   tooltip: 'Ver SCTR'
        // },
        // {
        //   id: 'Confirm',
        //   title: 'Confirmar',
        //   tooltip: 'Confirmar SCTR'
        // },
        {
          id: 'Delete',
          title: 'Eliminar',
          tooltip: 'Eliminar SCTR'
        }],
      moreActionsDisabled: false,
      moreActionsVisible: true
    } as ActionConfig;
    let confirm: boolean = item.Status;
    let del: boolean = item.StatusDelete;
    let edit: boolean = item.StatusEdit;
    // if (!confirm) {
    //   actionConfig.moreActionsStyleClass = 'red';
    //   actionConfig.primaryActions[0].styleClass = 'red';
    // } else {
    //   actionConfig.moreActions[1].visible = false;
    // }
    // if (!edit) {
    //   actionConfig.primaryActions[0].visible = false;
    // }
    // if (!del) {
    //   actionConfig.moreActions[2].visible = false;
    // }
    return actionConfig;
  }

  // Filter
  filterChanged($event: FilterEvent): void {
    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.id + ' : ' + filter.value + '\n';
    });
    this.token.setFilterCriteriaReq($event.appliedFilters);
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


  // Methods
  search(): void {
    console.log('Table search!');

    // this.sctrList = [
    //   {
    //     IdRegistroSctr: 1,
    //     Codigo: '5e0ef57d-59ac-444d',
    //     Descripcion: 'SCTR PICHARI - NOVIEMBRE',
    //     FechaCreacion: '2020-11-09T09:32:28.036938',
    //     Estado: 'SIN CONFIRMAR',
    //     AliasExpediente: '104 C.S. PICHARI'
    //   },
    //   {
    //     IdRegistroSctr: 20,
    //     Codigo: '5e0ef57d-59ac-444d',
    //     Descripcion: 'SCTR PICHARI - DICIEMBRE',
    //     FechaCreacion: '2020-12-15T09:32:28.036938',
    //     Estado: 'SIN CONFIRMAR',
    //     AliasExpediente: '104 C.S. PICHARI'
    //   }
    // ];


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


    //this.dataService.requeriments().search(criteria).subscribe((data) => {
    this.dataService.sctrRegistry().search(criteria).subscribe((data) => {

      this.searchResult = data;
      this.sctrList = this.searchResult.items;
      this.toolbarConfig.filterConfig.resultsCount = this.searchResult.totalSize;
      this.paginationConfig.totalItems = this.searchResult.totalSize;


      

      console.log(data);
      
    },
      error => {
        this.toastr.error('Ocurrieron problemas', 'Error');
        this.loading = false;
      },
      () => {
        this.loading = false;
      });
  }

  // Table Action Handler
  handleActionGrid(action: Action, item: any): void {

    const actionType: string = action.title;
    console.log(`Action => ${actionType}`);

    switch (actionType) {

      case 'Editar':
        this.router.navigate(['./', item.idRegistroSctr], { relativeTo: this.activatedRoute });
        break;

      case 'Ver':
        this.router.navigate(['./view', item.idRegistroSctr], { relativeTo: this.activatedRoute });
        break;

      case 'Confirmar':
        //this.router.navigate(['./view', item.IdRegistroSctr], { relativeTo: this.activatedRoute });
        break;

      case 'Eliminar':

        let modal = this.bsModalService.show(ConfirmationModalComponent, { keyboard: false, backdrop: 'static' });
        (<ConfirmationModalComponent>modal.content).showConfirmationModal(
          'Estas Seguro de Eliminar el requerimiento N° ',
          item.CodRequirement
        );
        (<ConfirmationModalComponent>modal.content).onClose.subscribe(result => {
          if (result === true) {
            console.log('Eliminando registro');
            // let iduser: any = this.dataService.users().getUserId();
            // const queryParams: URLSearchParams = new URLSearchParams();
            // queryParams.set('id', item.IdRequirement);
            // queryParams.set('idUser', iduser);
            // this.dataService.requeriments().delete(queryParams).subscribe(
            //   response => {
            //     this.toastr.success('El requerimiento fue eliminado correctamente.', 'Informacion');
            //     this.search();
            //   },
            //   error => {
            //     this.toastr.error('Ocurrio un error al eliminar este requerimiento, intentelo nuevamente.', 'Error');
            //   }
            // );
          }
        });

      default:
        break;
    }
  }

  //for pagination
  handlePageSize($event: PaginationEvent) {
    this.paging.pageSize = $event.pageSize;
    this.token.setPagingCriteriaReq(this.paging);
    this.search();
  }

  handlePageNumber($event: PaginationEvent) {
    this.paging.page = $event.pageNumber;
    this.token.setPagingCriteriaReq(this.paging);
    this.search();
  }
}
