import { DataService } from './../../../../../core/data/data.service';
import { FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ToastsManager } from 'ng2-toastr';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'sacpi-contratos-list',
  templateUrl: './contratos-list.component.html',
  styleUrls: ['./contratos-list.component.scss']
})
export class ContratosListComponent implements OnInit {
  expedients: any[] = [];
  loading = false;

  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private dataService: DataService,
    private notification: ToastsManager) { }

  ngOnInit() {
    this.loadExpedients();
  }

  //centros de costo
  loadExpedients() {
    this.loading = true;
    let id = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => { this.expedients = data; this.loading = false; });
  }

  loadContratos(){

    console.log("servicio de all contratos ");
    let idExpediente = 101;
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('idExpediente', idExpediente.toString());
    this.dataService.expedients().getAllContracts(queryParams).subscribe((data : any[])=>{
      console.log("data de contra" + JSON.stringify(data));
    });
    // this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => { this.expedients = data; this.loading = false; });
  }
}
