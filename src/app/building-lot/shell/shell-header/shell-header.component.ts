import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, Input } from '@angular/core';

import { Expedient } from './../../../core/model/expedient.model';

@Component({
  selector: 'sacpi-shell-header',
  templateUrl: './shell-header.component.html',
  styleUrls: ['./shell-header.component.scss']
})
export class ShellHeaderComponent implements OnInit {
  @Input()
  currentExpedient: Expedient;

  @Input()
  expedients: Array<Expedient>;

  authz: any;
  user: any = {
    username: ''
  };

  constructor(
    private router: Router,
    private route: ActivatedRoute) { }

  ngOnInit() {
    this.user.username='';
  }
  accountManagement() {
   console.log("accountManagement");
  }

  logout() {
    console.log("logout");
  }

  about() {
    console.log("about");
  }
}
