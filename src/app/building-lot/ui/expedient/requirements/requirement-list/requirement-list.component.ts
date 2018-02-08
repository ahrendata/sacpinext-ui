import { Component, OnInit, ViewContainerRef, TemplateRef, ViewEncapsulation, ViewChild } from '@angular/core';
import { Requirement } from '../../../../../core/model/requirement.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../core/data/data.service';
import { ToastsManager } from 'ng2-toastr';
import { Expedient } from '../../../../../core/model/expedient.model';
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

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'sacpi-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss']
})

export class RequirementListComponent implements OnInit {
  actionConfig: ActionConfig;
  actionsText: string = '';
  //allItems: any[] = [];
  filterConfig: FilterConfig;
  filtersText: string = '';
  filtersServer: any[] = [];
  items: any[] = [];
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
  requirements: any[] = [];//: Array<Requirement> = new Array<Requirement>();
  filters: any = {
    filterText: undefined
  };

  @ViewChild('autoShownModal') autoShownModal: ModalDirective;
  isModalShown: boolean = false;

  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastsManager,
    private bsModalService: BsModalService,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.search();
    // console.log(this.dataService.users().getEmployeeId());
    // console.log(this.dataService.expedients().getUserId());
    this.filterConfig = {
      fields: [{
        id: 'CodRequirement',
        title: 'Codigo',
        placeholder: 'Filter by CodRequirement',
        type: FilterType.TEXT
      }, {
        id: 'AliasExpedient',
        title: 'Centro costo',
        placeholder: 'Filter by Birth AliasExpedient',
        type: FilterType.TEXT
      }, {
        id: 'AtentionDate',
        title: 'Fecha Atencion',
        placeholder: 'Filter by AtentionDate',
        type: FilterType.TEXT
      }] as FilterField[],

      resultsCount: this.items.length,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'CodRequirement',
        title: 'Codigo',
        sortType: 'alpha'
      }, {
        id: 'AliasExpedient',
        title: 'Centro costo',
        sortType: 'alpha'
      }, {
        id: 'Fecha atencion',
        title: 'AtentionDate',
        sortType: 'alpha'
      }],
      isAscending: this.isAscendingSort
    } as SortConfig;

    this.actionConfig = {
      primaryActions: [{
        id: 'NUEVO',
        title: 'Nuevo',
        tooltip: 'Generar nuevo requerimiento',
        styleClass:'btn-primary'
      }]
    } as ActionConfig;

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

  search(): void {
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    queryParams.set('pageNumber', this.page.toString());
    queryParams.set('PageSize', this.limit.toString());
    console.log("Apliacnado filtro..." + JSON.stringify(this.filtersServer));

    this.loading = true;
    this.dataService.requeriments().getAll(queryParams).subscribe((data: any) => {
      this.requirements = cloneDeep(data.data);// data.data;
      this.paginationConfig.totalItems = data.count;// this.requirements.length;
      this.paginationConfig.pageSize = this.limit;
      this.toolbarConfig.filterConfig.resultsCount = data.count;
    },
      error => {
        this.toastr.error('Something went wrong...', 'error');
        this.loading = false;
      },
      () => {
        //this.toastr.success('Getting all values complete', 'Complete');//
        this.loading = false;
      });
  }

  //button create requi
  handleAction(action: Action) {
    console.log(JSON.stringify(action));
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute });
  }
  // Actions
  doAdd(): void {
    this.actionsText = 'Add Action\n' + this.actionsText;
    // console.log('Add Action\n' + this.actionsText);
  }

  //button editar requerimimiento.
  handleActionGrid(action: Action, item: any): void {
    //this.actionsText = action.title + '\n' + this.actionsText;
    //validar si se puede editar el requerimiento.
    console.log("Edit requirement .... " + action.title);
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
            this.dataService.requeriments().delete(item.IdRequirement,queryParams).subscribe(
              response => {
                this.toastr.success('El requerimiento fue eliminado correctamente.', 'Informacion');
                this.search();
              },
              error => {
                this.toastr.error('Ocurrio un error al eliminar este requerimiento, intentelo nuevamente.', 'Error');
              }
            );
            console.log('si');
          } else if (result === false) {
            console.log('no');
          } else {
            console.log('else');
            // When closing the modal without no or yes
          }
        });
      }else{
        this.toastr.warning('El requerimiento no se puede eliminar, ya se hicieron la compra de algunos productos.', 'Alerta');//
      }
    }
    else if (action.title == "Ver")
      this.router.navigate(['./view', item.IdRequirement], { relativeTo: this.activatedRoute });
    else {
      let customFormat: string = "yyyyMMdd";
      console.log(new Date(item.CreateDate.toString()).getMonth() + "===" + new Date().getMonth())
      if (item.StatusEdit) {
        this.router.navigate(['./', item.IdRequirement], { relativeTo: this.activatedRoute });
      } else {
        this.toastr.warning('El requerimiento no se puede editar, las fechas no coincidden. Solo se pueden editar requerimientos generados el mismo dia.', 'Alerta');//
      }
    }
  }

  optionSelected(option: number): void {
    this.actionsText = 'Option ' + option + ' selected\n' + this.actionsText;
    //console.log(this.actionsText);
  }

  // Filter

  // applyFilters(filters: Filter[]): void {
  //   this.items = [];
  //   if (filters && filters.length > 0) {
  //     this.allItems.forEach((item) => {
  //       if (this.matchesFilters(item, filters)) {
  //         this.items.push(item);
  //       }
  //     });
  //   } else {
  //     this.items = this.allItems;
  //   }
  //   this.toolbarConfig.filterConfig.resultsCount = this.items.length;
  // }

  // Handle filter changes
  filterChanged($event: FilterEvent): void {

    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersServer.push({ field: filter.field.title, value: filter.value });
      this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
    });




    this.search();

    //this.applyFilters($event.appliedFilters);
    //this.filterFieldSelected($event);
  }

  // Reset filtered queries
  // filterFieldSelected($event: FilterEvent): void {
  //   this.filterConfig.fields.forEach((field) => {
  //     if (field.id === 'weekDay') {
  //       field.queries = [
  //         ...this.weekDayQueries
  //       ];
  //     }
  //   });
  // }

  matchesFilter(item: any, filter: Filter): boolean {
    let match = true;
    if (filter.field.id === 'name') {
      match = item.name.match(filter.value) !== null;
    } else if (filter.field.id === 'address') {
      match = item.address.match(filter.value) !== null;
    } else if (filter.field.id === 'birthMonth') {
      match = item.birthMonth === filter.value;
    } else if (filter.field.id === 'weekDay') {
      match = item.weekDay === filter.value;
    }
    return match;
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

  // Filter queries for type ahead
  filterQueries($event: FilterEvent) {
    const index = (this.filterConfig.fields as any).findIndex((i: any) => i.id === $event.field.id);
    let val = $event.value.trim();

    console.log("metothd filterQueries");

    if (this.filterConfig.fields[index].id === 'weekDay') {
      this.filterConfig.fields[index].queries = [
        ...this.weekDayQueries.filter((item: any) => {
          if (item.value) {
            return (item.value.toLowerCase().indexOf(val.toLowerCase()) > -1);
          } else {
            return true;
          }
        })
      ];
    }
  }

  // Sort

  compare(item1: any, item2: any): number {
    let compValue = 0;
    if (this.currentSortField.id === 'name') {
      compValue = item1.name.localeCompare(item2.name);
    } else if (this.currentSortField.id === 'address') {
      compValue = item1.address.localeCompare(item2.address);
    }
    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  // Handle sort changes
  sortChanged($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.items.sort((item1: any, item2: any) => this.compare(item1, item2));
  }

  // View

  viewSelected(currentView: ToolbarView): void {
    this.sortConfig.visible = (currentView.id === 'tableView' ? false : true);
  }





  /**
   * Get the ActionConfig properties for each row
   *
   * @param item The current row item
   * @param actionButtonTemplate {TemplateRef} Custom button template
   * @param startButtonTemplate {TemplateRef} Custom button template
   * @returns {ActionConfig}
   */
  getActionConfig(item: any, actionButtonTemplate: TemplateRef<any>,
    startButtonTemplate: TemplateRef<any>): ActionConfig {
    let actionConfig = {
      primaryActions: [
        {
          id: 'Editar',
          title: 'Editar',
          tooltip: 'Editar Requerimiento'

        }],
      moreActions: [{
        id: 'Confirm',
        title: 'Confirmar',
        tooltip: 'Confirmar Requerimiento'
      }, {
        id: 'Delete',
        title: 'Eliminar',
        tooltip: 'Eliminar Requerimiento'
      }, {
        id: 'Print',
        title: 'Ver',
        tooltip: 'Ver Requerimiento'
      }],
      moreActionsDisabled: false,
      moreActionsVisible: true
    } as ActionConfig;

    // Set button disabled
    if (item.started === true) {
      actionConfig.primaryActions[0].disabled = true;
    }

    // Set custom properties for row
    if (item.name === 'John Smith') {
      actionConfig.moreActionsStyleClass = 'red'; // Set kebab option text red
      actionConfig.primaryActions[1].visible = false; // Hide first button
      actionConfig.primaryActions[2].disabled = true; // Set last button disabled
      actionConfig.primaryActions[3].styleClass = 'red'; // Set last button text red
      actionConfig.moreActions[0].visible = false; // Hide first kebab option
    }

    // Hide kebab
    if (item.name === 'Frank Livingston') {
      actionConfig.moreActionsVisible = false;
    }
    return actionConfig;
  }

  //for pagination
  handlePageSize($event: PaginationEvent) {
    this.limit = $event.pageSize;
    this.search();
  }

  handlePageNumber($event: PaginationEvent) {
    this.page = $event.pageNumber;
    //this.limit = 5;
    this.search();
  }
}
