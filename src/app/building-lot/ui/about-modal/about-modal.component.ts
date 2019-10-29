import { Component, OnInit, TemplateRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AboutModalConfig } from 'patternfly-ng/modal';

@Component({
  encapsulation: ViewEncapsulation.Emulated,
  selector: 'sacpi-about-modal',
  templateUrl: './about-modal.component.html',
  styleUrls: ['./about-modal.component.scss']
})
export class AboutModalComponent implements OnInit {

  aboutConfig: AboutModalConfig;
  modalRef: BsModalRef;

  @ViewChild('aboutTemplate', {static: false}) aboutTemplate: any;

  constructor(private modalService: BsModalService) {

  }

  ngOnInit(): void {
    this.aboutConfig = {
      additionalInfo: 'SacpiNext is a software registered on Goverment, for more information contact us.',
      copyright: 'Trademark and Copyright Information',
      logoImageAlt: 'Patternfly Symbol',
      logoImageSrc: '//www.patternfly.org/assets/img/logo-alt.svg',
      title: 'Sacpi|Next',
      productInfo: [
        { name: 'Version', value: '1.0.0.0.20160819142038_51be77c' },
        { name: 'Server Name', value: 'Next' },
        { name: 'User Name', value: 'A5' },
        { name: 'User Role', value: 'Asistente' }]
    } as AboutModalConfig;
  }

  open() {
    this.modalRef = this.modalService.show(this.aboutTemplate);
  }

  closeModal($event: any): void {
    this.modalRef.hide();
  }

}
