import { OrderBy } from './../../../core/model/order-by.model';
import { SearchCriteriaFilter } from './../../../core/model/search-criteria-filter.model';
import { Paging } from './../../../core/model/paging.model';
import { SearchCriteria } from './../../../core/model/search-criteria.model';
import { Component, OnDestroy, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { URLSearchParams } from '@angular/http';
import { ToastsManager } from 'ng2-toastr';

import { Expedient } from './../../../core/model/expedient.model';
import { DataService } from '../../../core/data/data.service';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';


@Component({
  selector: 'sacpi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  loading = false;
  expedients: Array<Expedient> = new Array<Expedient>();
  expedient: Expedient;

  searchCriteria: SearchCriteria = {
    filterText: null
  };
  filters: Array<SearchCriteriaFilter> = new Array<SearchCriteriaFilter>();
  orderBy: OrderBy = {
    name: 'CreatedTime',
    ascending: false
  };
  paging: Paging = {
    page: 1,
    pageSize: 10
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
    this.search();
  }

  search(): void {
    this.loading = true;
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());

    const criteria: SearchCriteria = {
      filterText: this.searchCriteria.filterText,
      filters: this.filters.map(f => {
        return new SearchCriteriaFilter(f.name, f.value, f.operator, f.type);
      }),
      orders: [this.orderBy],
      paging: this.paging
    };
    criteria.filters.push(new SearchCriteriaFilter('id', id.toString(), 'eq'));

    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => {
      this.expedients = data;
      this.notification.info('Error al obtener expedientes, usuario no tiene asigando ningun expediente.', 'Error');
    },
      error => {
         this.notification.error('Error al obtener expedientes, usuario no tiene asigando ningun expediente.', 'Error');
        this.loading = false;
      },
      () => {
        //    this.toastr.success('Getting all values complete', 'Complete');
        this.loading = false;
      });
  }

  changeAscending() {
    this.orderBy.ascending = !this.orderBy.ascending;
    this.search();
  }




  viewDetailExpediente(expedient: Expedient): void {
  }

  viewRequerimiento(expedient: Expedient) {
  }
}
