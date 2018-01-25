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
  filters: any = {
    filterText: undefined
  };


  dataSubscription: Subscription;
  expedient: Expedient;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef
  ) { this.toastr.setRootViewContainerRef(vcr); }

  ngOnInit() {
    // console.log(this.dataService.expedients().getEmployeeId());
    // console.log(this.dataService.expedients().getUserId());
    this.search();
  }

  search(): void {
    this.loading = true;
    this.dataService.expedients().getAll().subscribe((data: any[]) => this.expedients = data,
      error => () => {
        this.toastr.error('Something went wrong...', 'error');
        this.loading = false;
      },
      () => {
        this.toastr.success('Getting all values complete', 'Complete');
        this.loading = false;
      });
  }

  viewDetailExpediente(expedient: Expedient): void {
    console.log(expedient);
    this.router.navigate(['/expedients', expedient.IdExpediente]);
  }

  viewRequerimiento(expedient: Expedient) {
    this.router.navigate(['/expedients', expedient.IdExpediente]);
  }
}
