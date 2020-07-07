import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../core/data/data.service';
import { NavigationItemBase} from 'patternfly-ng';

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

  navigationItems: NavigationItemBase[];


  ngOnInit() {
    this.navigationItems = [
      {
        title: 'Dashboard',
        iconStyleClass: 'fa fa-dashboard',
        url: './dashboard',
        badges: [{ id: 1 }]
      },
      {
        title: 'Centro Costo',
        iconStyleClass: 'fa fa-folder',
        url: './center-coste',
        badges: [{ id: 1 }]
      },
      {
        title: 'Req. de Producto',
        iconStyleClass: 'fa fa-file-text',
        url: './expedients/requirements',
        badges: [{ id: 1 }]
      },
      {
        title: 'Req. de Servicio',
        iconStyleClass: 'fa fa-file-text',
        url: './expedients/services',
        badges: [{ id: 1 }]
      },
      {
        title: 'Contrato',
        iconStyleClass: 'fa fa-file-text',
        url: './expedients/contract',
        badges: [{ id: 1 }]
      },
      {
        title: 'Reportes',
        iconStyleClass: 'fa fa-bar-chart',
        url: 'reports',
        badges: [{ id: 1,
        mobileItem : true,
        children:[
          {
            title: 'Saldos Productos',
            url: './reports/product-balance',
            badges: [{ id: 1 }]
          },
        ] 
      }],
      },
      {
        title: 'Cuenta',
        iconStyleClass: 'fa fa-user',
        url: './acount',
        badges: [{ id: 1 ,
        mobileItem: true,
        children: [
          {
            title: 'Administrar Cuenta',
            url: './acount',
            badges: [{ id: 1 }]
          },
          {
            title: 'Cambiar Contraseña',
            url: './change-password',
            badges: [{ id: 1 }]
          },
          {
            title: 'Cerrar Session',
            url: './login',
            badges: [{ id: 3 }]
          }
        ]
      }],
        
      }
    ];
  }

  onItemClicked($event: NavigationItemBase): void {
    if ($event.badges[0].id === 3) {
      this.dataService.users().logout();
    }
    this.router.navigate([$event.url], { relativeTo: this.route });
  }
}

