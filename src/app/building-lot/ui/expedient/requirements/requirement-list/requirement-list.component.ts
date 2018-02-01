import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Requirement } from '../../../../../core/model/requirement.model';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '../../../../../core/data/data.service';
//import { ToastsManager } from 'ng2-toastr';
import { Expedient } from '../../../../../core/model/expedient.model';
import { URLSearchParams } from '@angular/http';

@Component({
  selector: 'sacpi-requirement-list',
  templateUrl: './requirement-list.component.html',
  styleUrls: ['./requirement-list.component.scss']
})

export class RequirementListComponent implements OnInit {

  loading = false;  
  requirements: Array<Requirement> = new Array<Requirement>();
  filters: any = {
    filterText: undefined
  };
  constructor(private router: Router,
    private activatedRoute: ActivatedRoute,
    private dataService: DataService,
   // private toastr: ToastsManager,
    vcr: ViewContainerRef) {
   // this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.search();
    // console.log(this.dataService.users().getEmployeeId());
    // console.log(this.dataService.expedients().getUserId());
  }

  search(): void { 
    let id=this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    //queryParams.set('max', '5');

    this.loading = true;
    this.dataService.requeriments().getAll(queryParams).subscribe((data: any[]) => this.requirements = data,
      error => {
        //this.toastr.error('Something went wrong...', 'error');
        this.loading = false;
      },
      () => {
       // this.toastr.success('Getting all values complete', 'Complete');
        this.loading = false;
        console.log(JSON.stringify(this.requirements));
      });
  }

  createRequirement(){
    this.router.navigate(['./create'], { relativeTo: this.activatedRoute });
  }
}
