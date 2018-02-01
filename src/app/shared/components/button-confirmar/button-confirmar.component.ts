import { Component, EventEmitter, OnInit, Output } from '@angular/core';

@Component({
  selector: 'sacpi-button-confirmar',
  templateUrl: './button-confirmar.component.html',
  styleUrls: ['./button-confirmar.component.scss']
})
export class ButtonConfirmarComponent implements OnInit {


  @Output()
  sacpiConfirmar: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  confirmar() {
    this.sacpiConfirmar.emit(true);
  }

}
