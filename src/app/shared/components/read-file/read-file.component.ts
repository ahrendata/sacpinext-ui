import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ToastsManager } from 'ng6-toastr';
@Component({
  selector: 'sacpi-read-file',
  templateUrl: './read-file.component.html',
  styles: [`
    input[type=file] {
      display: none;
    }
  `  ]
})
export class ReadFileComponent implements OnInit {


  @Input()
  showFileName = false;

  @Input()
  asText = true;

  @Input()
  asArrayBuffer = false;

  @Input()
  asDataUrl = false;

  @Input()
  asBinaryString = false;

  @Output()
  complete: EventEmitter<[any]> = new EventEmitter<[any]>();

  file: any = {
    fileName: undefined,
    data: undefined
  };

  constructor(
    private notification: ToastsManager
  ) { }

  ngOnInit() {
  }

  totalFiles = []

  changeListener($event: any) {

    const self = this;
    // var fd = new  FormData();
    if ($event.target.files && $event.target.files[0]) {
      const files: File = $event.target.files;
      var filesAmount = $event.target.files.length;
      for (let i = 0; i < filesAmount; i++) {
        //2097152
        if(files[i].size<= 22020096){ 
        var reader = new FileReader();
        reader.onloadend = function (e: any) {
          self.file.fileName = files[i].name;
          self.file.data = e.target.result;
          self.complete.next(self.file);
        };
        if (this.asText) {
          reader.readAsText($event.target.files[i]);
        }
        if (this.asDataUrl) {
          reader.readAsDataURL($event.target.files[i]);
        }
        if (this.asArrayBuffer) {
          reader.readAsArrayBuffer($event.target.files[i]);
        }
        if (this.asBinaryString) {
          reader.readAsBinaryString($event.target.files[i]);
        }
        }else{
          this.notification.error('El archivo  ' +files[i].name + 'Seleccionado excede los 20MB, seleccione otro' , 'error');
        }
      }
    }
  }
}
