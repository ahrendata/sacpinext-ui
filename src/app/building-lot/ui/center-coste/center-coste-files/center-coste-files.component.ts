import { Component, OnInit, TemplateRef, ViewContainerRef } from '@angular/core';
import { Paging } from '../../../../core/model/paging.model';
import { OrderBy } from '../../../../core/model/order-by.model';
import { ListConfig } from 'patternfly-ng/list';
import { DataService } from '../../../../core/data/data.service';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastsManager } from 'ng6-toastr';
import { URLSearchParams } from '@angular/http';

//for toolbar
import { Action, ActionConfig } from 'patternfly-ng/action';
import { Filter, FilterConfig, FilterField, FilterEvent, FilterType } from 'patternfly-ng/filter';
import { SortConfig, SortField, SortEvent } from 'patternfly-ng/sort';
import { ToolbarConfig, ToolbarView } from 'patternfly-ng/toolbar';

//for pagination
import { PaginationConfig, PaginationEvent } from 'patternfly-ng/pagination';

//for list
import { EmptyStateConfig } from 'patternfly-ng/empty-state';
import { SearchCriteria } from '../../../../core/model/search-criteria.model';
import { Requirement } from '../../../../core/model/requirement.model';
import { SearchResults } from '../../../../core/model/search-results.model';
import { SearchCriteriaFilter } from '../../../../core/model/search-criteria-filter.model';

//modal
import { BsModalService } from 'ngx-bootstrap/modal';
import { ConfirmationModalComponent } from '../../../../shared/components/confirmation-modal/confirmation-modal.component';

export class modelFile {
  fileName: string;
  data: string;
}

@Component({
  selector: 'sacpi-center-coste-files',
  templateUrl: './center-coste-files.component.html',
  styleUrls: ['./center-coste-files.component.scss'],
})
export class CenterCosteFilesComponent implements OnInit {
  requirements: Array<Requirement> = new Array<Requirement>();//eliminar 
  filtersText: string = '';
  expedients: any[] = [];
  archivos: any[] = [];
  loading = false;
  filterConfig: FilterConfig;
  requirementType: any[] = [];
  sortConfig: SortConfig;
  toolbarConfig: ToolbarConfig;
  listConfig: ListConfig;
  paginationConfig: PaginationConfig;
  emptyStateConfig: EmptyStateConfig;
  idExpedienteSeleccionado: number;

  searchResult: SearchResults<any> = new SearchResults<any>();
  filters: Array<SearchCriteriaFilter> = new Array<SearchCriteriaFilter>();
  orderBy: OrderBy = {
    name: 'fileName',
    ascending: false
  };
  paging: Paging = {
    page: 1,
    pageSize: 5
  };

  //forms
  form: FormGroup;
  
  centroCostoName: string = "";
  idExpediente: number;
  IdExpediente: number;
  tipoComprobantes: any[] = [];
  idUsuario: number;
  idTrabajador: number;
  //tipo Documento "centro costo"
  tipoDocumento: number = 4;

  totalziseFile: number = 0;
  totalFiles: number;

  allRows : any[];

  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private dataService: DataService,
    private bsModalService: BsModalService,
    private toastr: ToastsManager,
    vcr: ViewContainerRef) {
    this.toastr.setRootViewContainerRef(vcr);
  }

  ngOnInit() {
    this.getIdExpedienteFromUrl();
    this.inittoolbar();
    this.loadExpedients();
    this.initForm();
    this.getListTipoComprobante();
    this.getListFiles();
    this.totalFiles = this.files.length;

    this.emptyStateConfig = {
      iconStyleClass: 'pficon-warning-triangle-o',
      title: 'Ningún Archivo',
      info: 'El centro de costo seleccionado no cuenta con ningún archivo adjunto',
    } as EmptyStateConfig;

    this.listConfig = {
      dblClick: false,
      emptyStateConfig: this.emptyStateConfig,
     // multiSelect: false,
      //selectItems: true,
      // showCheckbox: false,
      // useExpandItems: false
    } as ListConfig;

    this.paginationConfig = {
      pageSize: this.paging.pageSize,
      pageNumber: this.paging.page,
      totalItems: this.searchResult.totalSize
    } as PaginationConfig;
  }

  inittoolbar() {
    this.filterConfig = {
      fields: [{
        id: 'fileName',
        title: 'Nombre',
        placeholder: 'filtro por nombre archivo...',
        type: FilterType.TEXT
      }
      ] as FilterField[],
       resultsCount: this.searchResult.totalSize,
      appliedFilters: []
    } as FilterConfig;

    this.sortConfig = {
      fields: [{
        id: 'fileName',
        title: 'Nombre',
        sortType: 'alpha'
      }
      ],
      isAscending: false
    } as SortConfig;

    this.toolbarConfig = {
      filterConfig: this.filterConfig,
      sortConfig: this.sortConfig,
      views: [{
        id: 'listView',
        iconStyleClass: 'fa fa-th-list',
        tooltip: 'List View'
      }
      , {
        id: 'tableView',
        iconStyleClass: 'fa fa-table',
        tooltip: 'Table View'
      }
    ]
    } as ToolbarConfig;

  }

  //centros de costo
  loadExpedients() {
    console.log("carga de expedientes");
    
    this.loading = true;
    let id = this.dataService.users().getEmployeeId();
    this.idUsuario = this.dataService.users().getUserId();
    this.idTrabajador = this.dataService.users().getEmployeeId();
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('id', id.toString());
    this.dataService.expedients().getAll(queryParams).subscribe((data: any[]) => {
      this.expedients = data;
      this.loading = false;
      this.expedients.forEach(element => {
        if (element.IdExpediente == this.idExpediente) {
          this.centroCostoName = element.Alias;
          this.form.setValue({ idExpediente: element.IdExpediente, tipoDocumento: this.tipoDocumento, idUsuario: this.idUsuario, idTrabajador: this.idTrabajador, files: [] });
        }
      });
    });
  }

  initForm() {
    this.form = this.formBuilder.group({
      idExpediente: new FormControl(this.IdExpediente, Validators.required),
      tipoDocumento: [this.tipoDocumento],
      idUsuario: [this.idUsuario],
      idTrabajador: [this.idTrabajador],
      files: this.formBuilder.array([])
    });
  }

  saveFiles(): void {
    if (this.totalziseFile <= 20) {
      if (this.form.valid) {
        this.dataService.files().saveNext(this.form.value).subscribe(resp => {
          if (resp.success) {
            this.toastr.success(resp.message, 'Exito');
            this.cancelar();
            this.getListFiles();
            
          } else {
            this.toastr.error('ocurrio un error mientras se guardaban sus archivos', 'Alerta');
          }
        });
      } else {
        this.toastr.warning('seleccione el tipo de Documento', 'Alerta');
      }
    } else {
      this.toastr.error('Sobrepaso el limite permitido de 20MB, elimine algunos archivos e intentelo de nuevo', 'Alerta');
    }
  }

  get files(): FormArray {
    return this.form.get('files') as FormArray;
  }

  //for pagination
  handlePageSize($event: PaginationEvent) {
    console.log("event size "+ JSON.stringify($event));
    
    this.paging.pageSize = $event.pageSize;
    this.paginationAll();
    // this.getListFiles();
  }

  handlePageNumber($event: PaginationEvent) {
    console.log("event number "+ JSON.stringify($event));
    this.paging.page = $event.pageNumber;
    // this.getListFiles();
    this.paginationAll();
  }

  handleSortChanged($event: SortEvent): void {
    this.currentSortField = $event.field;
    this.isAscendingSort = $event.isAscending;
    this.allRows.sort((item1: any, item2: any) => this.compare(item1, item2));
    this.applyFilters(this.filterConfig.appliedFilters || []);
  }

  // Sort
  currentSortField: SortField;
  isAscendingSort: boolean = true;
  compare(item1: any, item2: any): number {    
    let compValue = 0;
    if (this.currentSortField.id === 'fileName') {
      if(item1.fileName){
        compValue = item1.fileName.localeCompare(item2.fileName);
      }
     } 
  
    if (!this.isAscendingSort) {
      compValue = compValue * -1;
    }
    return compValue;
  }

  // View
  viewSelected(currentView: ToolbarView): void {
    this.sortConfig.visible = (currentView.id === 'tableView' ? false : true);
  }

  filterChanged($event: FilterEvent): void {
    console.log("filterChanged " + JSON.stringify($event));
    this.filtersText = '';
    $event.appliedFilters.forEach((filter) => {
      this.filtersText += filter.field.title + ' : ' + filter.value + '\n';
    });
    this.applyFilters($event.appliedFilters);
  }

  filteredRows;
  applyFilters(filters: Filter[]): void {
    this.filteredRows = [];
    if (filters && filters.length > 0) {
      this.allRows.forEach((item) => {
        if (this.matchesFilters(item, filters)) {
          this.filteredRows.push(item);
        }
      });
    } else {
      this.filteredRows = this.allRows;
    }
     this.filterRows = true;
    // this.requirements = this.filteredRows;
    // this.toolbarConfig.filterConfig.resultsCount = this.filteredRows.length;
     this.paginationAll();
  }

  matchesFilters(item: any, filters: Filter[]): boolean {
    let matches = true;
    filters.forEach((filter) => {
      if (!this.matchesFilter(item, filter)) {
        matches = false;
        return matches;
      }
    });
    return matches;
  }

  matchesFilter(item: any, filter: Filter): boolean {
    let match = true;
    let re = new RegExp(filter.value, 'i');
    try {
      if (filter.field.id === 'fileName') {
        match = item.fileName.match(re) !== null;
      }
      return match;
    } catch (error) {
      console.log("error ", error);
    }

  }

  getIdExpedienteFromUrl() {
    this.route.queryParams.subscribe(params => {
      this.idExpediente = params['id'];
      this.idExpedienteSeleccionado = this.idExpediente;
    });

  }

  change() {
    if (this.idExpedienteSeleccionado != this.idExpediente) {
      this.expedients.forEach(element => {
        if (element.IdExpediente == this.idExpedienteSeleccionado) {
          this.centroCostoName = element.Alias;
          this.idExpediente = this.idExpedienteSeleccionado;
        }
      });
      this.getListFiles();
    }
  }

  
  onFileChange($event) {
    const formGroup = this.formBuilder.group({
      idFile: [null, Validators.compose([Validators.maxLength(150)])],
      fileName: [$event.fileName, Validators.compose([Validators.required, Validators.minLength(1)])],
      data: [$event.data, Validators.compose([Validators.required, Validators.minLength(1)])],
      size: [$event.size, Validators.compose([Validators.required, Validators.minLength(1)])],
      sizeNumber: [$event.sizeNumber, Validators.compose([Validators.required, Validators.minLength(1)])],
      tipoComprobante: [null, Validators.compose([Validators.required, Validators.minLength(1)])],
    });
    this.files.push(formGroup);
    this.totalFiles = this.files.length;
    this.totalsize();
  }

  getListTipoComprobante() {
    this.dataService.requeriments().getlistTipoDocumento().subscribe((data: any[]) => {
      this.tipoComprobantes = data;
    });
  }

  deleteFile(item, index) {
    this.files.removeAt(index);
    this.totalFiles = this.files.length;
    this.totalsize();
  }

  async totalsize() {
    var total = 0;
    await this.files.controls.forEach(element => {
      total = total + element.value.sizeNumber;
    });

    var totalM = Math.round(((total / 1024) * 100) * 0.000977) / 100;
    this.totalziseFile = totalM;
    if (totalM <= 20) {

    } else {
      this.toastr.error('Sobrepaso el máximo de tamaño permitido para el envio de los archivos, elimine algunos archivos', 'Alerta');
    }

  }

   getListFiles() {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('idDocumentoOrigen', this.idExpediente.toString());
    this.dataService.files().getAll(queryParams).subscribe((data: any) => {
      this.allRows = data;      
      // this.toolbarConfig.filterConfig.resultsCount = data.length;
      // this.toolbarConfig.filterConfig.totalCount = data.length;
      this.paginationConfig.totalItems = data.length;
      this.paginationAll();
    });
  }

  delete(file) {
    let modal = this.bsModalService.show(ConfirmationModalComponent, { keyboard: false, backdrop: 'static' });
    (<ConfirmationModalComponent>modal.content).showConfirmationModal(
      'Estas Seguro de Eliminar el archivo  ',
      file.fileName
    );
    (<ConfirmationModalComponent>modal.content).onClose.subscribe(result => {
      if (result === true) {
        let iduser = this.dataService.users().getUserId();
        const queryParams: URLSearchParams = new URLSearchParams();
        queryParams.set('idFile', file.idFile.toString());
        queryParams.set('idUser', iduser.toString());
        this.dataService.files().deleteNext(queryParams).subscribe(data => {
          if (data) {
            this.toastr.success('Su archivo se elimino correctamente!', 'Informacion');
            this.filterConfig.appliedFilters=[];
            this.getListFiles();
          } else {
            this.toastr.error('Error al eliminar el archivo, intentelo nuevamente', 'Error');
          }
        });
      }
    });
  }

  download(idFile) {
    const queryParams: URLSearchParams = new URLSearchParams();
    queryParams.set('idFile', idFile.toString());
    this.dataService.files().DownloadNext(queryParams).subscribe(data => {
      var byteString = atob(data.File);
      var ab = new ArrayBuffer(byteString.length);
      var ia = new Uint8Array(ab);
      for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
      }
      var blob = new Blob([ia]);
      const fileName = data.FileName;
      if (navigator.msSaveBlob) {
        navigator.msSaveBlob(blob, fileName);
      } else {
        const link = document.createElement('a');
        if (link.download !== undefined) {
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);
          link.setAttribute('download', fileName.slice(1,fileName.length));
          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      }
    });
  }

  filterRows : boolean = false;
  paginationAll(){
    if(this.filterRows){
      this.paginationConfig.pageNumber =1;
      // this.paginationConfig.pageSize= ;
      this.paginationConfig.totalItems= this.filteredRows.length;
      this.archivos = this.filteredRows.slice(((this.paginationConfig.pageNumber-1) * this.paginationConfig.pageSize), (this.paginationConfig.pageNumber * this.paginationConfig.pageSize));
      this.filterRows = false;
    }else{
      this.paginationConfig.totalItems= this.allRows.length;
      this.archivos = this.allRows.slice(((this.paginationConfig.pageNumber-1) * this.paginationConfig.pageSize), (this.paginationConfig.pageNumber * this.paginationConfig.pageSize));
    }
  }

  cancelar() {
    while (this.files.length !== 0) {
      this.files.removeAt(0);
      this.totalFiles = this.files.length;
      this.filterConfig.appliedFilters =[];
      this.getListFiles();
      this.totalsize();
    }
    console.log("total files ", this.files.value);
  }
}
