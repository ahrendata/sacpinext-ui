import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data/data.service';

@Component({
  selector: 'sacpi-shell-sidebar',
  templateUrl: './shell-sidebar.component.html',
  styleUrls: ['./shell-sidebar.component.scss']
})
export class ShellSidebarComponent implements OnInit {

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dataService: DataService) { }

  ngOnInit() {
  }

  logout() {
    this.dataService.users().logout();
    this.router.navigate(['./login'], { relativeTo: this.route });
  }
  
  accountManagement() {
    console.log("accountManagement");
  }
}

