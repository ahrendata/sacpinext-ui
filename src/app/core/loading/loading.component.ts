import { Component, OnInit } from '@angular/core';
import { LoadingService } from './loading.service';

@Component({
  selector: 'sacpi-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent implements OnInit {

  loading: boolean;

  constructor(private loadingService: LoadingService) { }

  ngOnInit() {
    this.loadingService.loading.subscribe(data => {
      this.loading = data;
    });
  }

}
