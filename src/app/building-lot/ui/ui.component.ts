import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { Expedient } from '../../core/model/expedient.model';
import { DataService } from '../../core/data/data.service';



@Component({
  selector: 'sacpi-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class SacpiUIComponent implements OnInit, OnDestroy {

  dataSubscription: Subscription;
  expedient: Expedient;
  expedients: Array<Expedient>;


  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(
      (data) => {
        this.expedient = data['expedient'];
      }
    );
    this.loadAllowedexpedients();

  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  loadAllowedexpedients() {
    // this.dataService.expedients().getAll().subscribe(
    //   (data) => {
    //     this.expedients = data;
    //   }
    // );
  }

}
