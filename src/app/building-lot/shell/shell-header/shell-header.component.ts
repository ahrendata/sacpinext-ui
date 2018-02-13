import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

import { Expedient } from './../../../core/model/expedient.model';
import { DataService } from '../../../core/data/data.service';

@Component({
  selector: 'sacpi-shell-header',
  templateUrl: './shell-header.component.html',
  styleUrls: ['./shell-header.component.scss']
})
export class ShellHeaderComponent implements OnInit {

  public isCollapsed: boolean = false;

  user: any = {
    username: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService) { }

  ngOnInit() {
    this.user.username = this.dataService.users().getUser();
  }
  
  accountManagement() {
    console.log("accountManagement");
  }

  collapsed() {
    this.isCollapsed = true;
  }

  logout() {
    this.dataService.users().logout();
    this.router.navigate(['./login'], { relativeTo: this.route });
  }
}
