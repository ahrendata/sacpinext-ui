import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastsManager } from 'ng6-toastr';

import { DataService } from '../../../core/data/data.service';



@Component({
  selector: 'sacpi-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

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

  }
}
