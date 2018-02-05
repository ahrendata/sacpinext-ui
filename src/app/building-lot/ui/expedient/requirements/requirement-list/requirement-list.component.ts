import { Component, OnInit, ViewContainerRef, TemplateRef,ViewEncapsulation } from '@angular/core';
import { Requirement } from '../../../../../core/model/requirement.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../core/data/data.service';
// import { ToastsManager } from 'ng2-toastr';
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

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'sacpi-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss']
})

export class RequirementListComponent implements OnInit {
  actionConfig: ActionConfig;
  actionsText: string = '';
  allItems: any[]=[];
  filterConfig: FilterConfig;
  filtersText: string = '';
  items: any[]=[];
  isAscendingSort: boolean = true;
  separator: Object;
  sortConfig: SortConfig;
  currentSortField: SortField;
  toolbarConfig: ToolbarConfig;
  weekDayQueries: any[];
  monthVals: any = {
    'January': 1,
    'February': 2,
    'March': 3,
    'April': 4,
    'May': 5,
    'June': 6,
    'July': 7,
    'August': 8,
    'September': 9,
    'October': 10,
    'November': 11,
    'December': 12
  };

  weekDayVals: any = {
    'Sunday': 1,
    'Monday': 2,
    'Tuesday': 3,
    'Wednesday': 4,
    'Thursday': 5,
    'Friday': 6,
    'Saturday': 7
  };

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
  requirements : any[]=[];//: Array<Requirement> = new Array<Requirement>();
  filters: any = {
    filterText: undefined
  };
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    
    vcr: ViewContainerRef) {
   // this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.search();
    // console.log(this.dataService.users().getEmployeeId());
    // console.log(this.dataService.expedients().getUserId());
    this.allItems = [{
      name: 'Fred Flintstone',
      address: '20 Dinosaur Way, Bedrock, Washingstone',
      birthMonth: 'February',
      birthMonthId: 'month2',
      weekDay: 'Sunday',
      weekdayId: 'day1'
    }, {
      name: 'John Smith', address: '415 East Main Street, Norfolk, Virginia',
      birthMonth: 'October',
      birthMonthId: '10',
      weekDay: 'Monday',
      weekdayId: 'day2'
    }, {
      name: 'Frank Livingston',
      address: '234 Elm Street, Pittsburgh, Pennsylvania',
      birthMonth: 'March',
      birthMonthId: 'month3',
      weekDay: 'Tuesday',
      weekdayId: 'day3'
    }, {
      name: 'Judy Green',
      address: '2 Apple Boulevard, Cincinatti, Ohio',
      birthMonth: 'December',
      birthMonthId: 'month12',
      weekDay: 'Wednesday',
      weekdayId: 'day4'
    }, {
      name: 'Pat Thomas',
      address: '50 Second Street, New York, New York',
      birthMonth: 'February',
      birthMonthId: 'month2',
      weekDay: 'Thursday',
      weekdayId: 'day5'
    }];
    this.items =  cloneDeep(this.allItems); //this.allItems;

    this.weekDayQueries = [{
      id: 'day1',
      value: 'Sunday'
    }, {
      id: 'day2',
      value: 'Monday'
    }];

    this.filterConfig = {
      fields: [{
        id: 'name',
        title: 'Name',
        placeholder: 'Filter by Name...',
        type: FilterType.TEXT
      }, {
        id: 'address',
        title: 'Address',
        placeholder: 'Filter by Address...',
        type: FilterType.TEXT
      }, {
        id: 'birthMonth',
        title: 'Birth Month',
        placeholder: 'Filter by Birth Month...',
        type: FilterType.SELECT,
        queries: [{
          id: 'month1',
          value: 'January'
        }, {
          id: 'month2',
          value: 'February'
        }]
      }, {
        id: 'weekDay',
        title: 'Week Day',
        placeholder: 'Filter by Week Day...',
        type: FilterType.TYPEAHEAD,
        queries: [
          ...this.weekDayQueries
        ]
      }] as FilterField[],
      resultsCount: this.items.length,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'name',
        title: 'Name',
        sortType: 'alpha'
      }, {
        id: 'address',
        title: 'Address',
        sortType: 'alpha'
      }, {
        id: 'birthMonth',
        title: 'Birth Month',
        sortType: 'alpha'
      }, {
        id: 'weekDay',
        title: 'Week Day',
        sortType: 'alpha'
      }],
      isAscending: this.isAscendingSort
    } as SortConfig;

    this.actionConfig = {
      primaryActions: [{
        id: 'NUEVO',
        title: 'Nuevo',
        tooltip: 'Do the first thing'
        
      }],
      moreActions: [{
        id: 'moreActions1',
        title: 'Action',
        tooltip: 'Perform an action'
      }, {
        id: 'moreActions2',
        title: 'Another Action',
        tooltip: 'Do something else'
      }, {
        disabled: true,
        id: 'moreActions3',
        title: 'Disabled Action',
        tooltip: 'Unavailable action',
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
    queryParams.set('PageSize',this.limit.toString());

    this.loading = true;
    this.dataService.requeriments().getAll(queryParams).subscribe((data: any) => {      
      this.requirements = cloneDeep(data.data);// data.data;
      this.paginationConfig.totalItems = data.count;// this.requirements.length;
      this.paginationConfig.pageSize = this.limit;
      //this.total = data.count;     
    },
      error => {
        //this.toastr.error('Something went wrong...', 'error');
        this.loading = false;
      },
      () => {
        //this.toastr.success('Getting all values complete', 'Complete');
        this.loading = false;
        //this.total = data.count;
        //console.log(JSON.stringify(this.page));
      });
  }

  createRequirement(){
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute });
  }
 
  //button create requi
  handleAction(action: Action){
    console.log(JSON.stringify(action));
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute });
  }


  // Actions

  doAdd(): void {
    this.actionsText = 'Add Action\n' + this.actionsText;
  }

  //button editar requerimimiento.
  handleActionGrid(action: Action, item:any): void {
    this.actionsText = action.title + '\n' + this.actionsText;
    //validar si se puede editar el requerimiento.

    //console.log(JSON.stringify(item));
    this.router.navigate(['./',item.IdRequirement], { relativeTo: this.activatedRoute });
  }

  optionSelected(option: number): void {
    this.actionsText = 'Option ' + option + ' selected\n' + this.actionsText;
  }

  // Filter

  applyFilters(filters: Filter[]): void {
    this.items = [];
    if (filters && filters.length > 0) {
      this.allItems.forEach((item) => {
        if (this.matchesFilters(item, filters)) {
          this.items.push(item);
        }
      });
    } else {
      this.items = this.allItems;
    }
    this.toolbarConfig.filterConfig.resultsCount = this.items.length;
  }

  // Handle filter changes
  filterChanged($event: FilterEvent): void {
    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
    });
    this.applyFilters($event.appliedFilters);
    this.filterFieldSelected($event);
  }

  // Reset filtered queries
  filterFieldSelected($event: FilterEvent): void {
    this.filterConfig.fields.forEach((field) => {
      if (field.id === 'weekDay') {
        field.queries = [
          ...this.weekDayQueries
        ];
      }
    });
  }

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
    } else if (this.currentSortField.id === 'birthMonth') {
      compValue = this.monthVals[item1.birthMonth] - this.monthVals[item2.birthMonth];
    } else if (this.currentSortField.id === 'weekDay') {
      compValue = this.weekDayVals[item1.weekDay] - this.weekDayVals[item2.weekDay];
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
        id: 'Editar1',
        title: 'Editar',
        tooltip: 'Editar Requerimiento'
      }, {   
        id: 'Delete',
        title: 'Eliminar',
        tooltip: 'Eliminar Requerimiento'
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


  // handleSelectionChange($event: ListEvent): void {
  //   this.actionsText1 = $event.selectedItems.length + ' items selected\r\n' + this.actionsText1;
  //   console.log($event.selectedItems.length + ' items selected\r\n' + this.actionsText1);
  // }

  // handleClick($event: ListEvent): void {
  //   this.actionsText1 = $event.item.CodRequirement + ' clicked\r\n' + this.actionsText1;
  //   console.log(  $event.item.CodRequirement + ' clicked\r\n' + this.actionsText1);
  // }

  // handleDblClick($event: ListEvent): void {
  //   this.actionsText1 = $event.item.CodRequirement + ' double clicked\r\n' + this.actionsText1;
  //   console.log( $event.item.CodRequirement + ' double clicked\r\n' + this.actionsText1);
  // }


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
