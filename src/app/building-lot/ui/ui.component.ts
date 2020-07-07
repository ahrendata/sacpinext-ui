import { Component, OnDestroy, OnInit, Renderer2, Inject } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { ActivatedRoute } from '@angular/router';

import { Expedient } from '../../core/model/expedient.model';
import { Services } from '../../core/model/service.model';
import { DataService } from '../../core/data/data.service';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'sacpi-ui',
  templateUrl: './ui.component.html',
  styleUrls: ['./ui.component.scss']
})
export class SacpiUIComponent implements OnInit, OnDestroy {

  dataSubscription: Subscription;
  expedient: Expedient;
  expedients: Array<Expedient>;
  service : Services;
  services: Array<Services>;

  constructor(private route: ActivatedRoute,
    @Inject(DOCUMENT) private document: Document,
    private renderer: Renderer2) { 
      this.renderer.removeClass(document.body.parentElement, 'login-pf');
    }

  ngOnInit() {
    this.dataSubscription = this.route.data.subscribe(
      (data) => {
        this.expedient = data['expedient'];
      }
    );
    this.dataSubscription = this.route.data.subscribe(
      (data) => {
        this.service = data['service'];
      }
    );
    this.loadAllowedexpedients();

  }

  ngOnDestroy() {
    this.dataSubscription.unsubscribe();
  }

  loadAllowedexpedients() {  
  }

}
