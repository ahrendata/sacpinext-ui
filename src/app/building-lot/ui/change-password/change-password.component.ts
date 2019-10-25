import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { WizardComponent, WizardStepConfig, WizardConfig, WizardEvent, WizardStep, WizardStepComponent } from 'patternfly-ng';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../../../core/data/data.service';
import { ToastsManager } from 'ng6-toastr';
import { User } from '../../../core/model/user.model';

@Component({
  selector: 'sacpi-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {

  @ViewChild('wizard', {static: false}) wizard: WizardComponent;

  data: any = {
    name: '',
    user: ''
  };
  deployComplete: boolean = true;
  user: User;
  loading = false;
  // Wizard Step 1
  step1Config: WizardStepConfig;
  step1aConfig: WizardStepConfig;
  step1bConfig: WizardStepConfig;

  // Wizard Step 2
  step2Config: WizardStepConfig;
  step2aConfig: WizardStepConfig;
  step2bConfig: WizardStepConfig;

  // Wizard
  wizardConfig: WizardConfig;
  formOld: FormGroup;
  formNew: FormGroup;

  constructor(private router: Router, private route: ActivatedRoute,
    private formBuilder: FormBuilder, private dataService: DataService,
    private notification: ToastsManager,
    private viewContainerRef: ViewContainerRef
  ) {
    this.notification.setRootViewContainerRef(viewContainerRef);
  }

  ngOnInit(): void {
    this.initwizard();
    this.initform();
    this.data.name = this.dataService.users().getUser();
    this.data.user = this.dataService.users().getUserName();
  }
  initform() {
    this.formOld = this.formBuilder.group({
      UserName: [null, Validators.compose([Validators.required])],
      Password: [null, Validators.compose([Validators.required])]
    });
    this.addObservableControl(this.formOld);
    this.formNew = this.formBuilder.group({
      Password: [null, Validators.compose([Validators.required])],
      ConfirmPassword: [null, Validators.compose([Validators.required])]
    });
    this.addObservableControlNew(this.formNew);
  }
  addObservableControl(formGroup: FormGroup) {
    formGroup.get("UserName").valueChanges.subscribe(value => {
      if (formGroup.get("Password").value && formGroup.get("UserName").value) {
        this.nextControl(true);
      } else {
        this.nextControl(false);
      }
    });
    formGroup.get("Password").valueChanges.subscribe(value => {
      if (formGroup.get("UserName").value && formGroup.get("Password").value) {
        this.nextControl(true);
      } else {
        this.nextControl(false);
      }
    });
  }
  addObservableControlNew(formGroup: FormGroup) {
    formGroup.get("Password").valueChanges.subscribe(value => {
      if (formGroup.get("Password").value && formGroup.get("ConfirmPassword").value) {
        this.nextControlB(true);
      } else {
        this.nextControlB(false);
      }
    });
    formGroup.get("ConfirmPassword").valueChanges.subscribe(value => {
      if (formGroup.get("Password").value && formGroup.get("ConfirmPassword").value) {
        this.nextControlB(true);
      } else {
        this.nextControlB(false);
      }
    });

  }
  initwizard() {
    // Step 1
    this.step1Config = {
      id: 'step1',
      priority: 0,
      title: 'Usuario'
    } as WizardStepConfig;
    this.step1aConfig = {
      id: 'step1a',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 1,
      title: 'Datos Personales'
    } as WizardStepConfig;
    this.step1bConfig = {
      id: 'step1b',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 1,
      title: 'Nueva Contraseña'
    } as WizardStepConfig;

    // Step 2
    this.step2Config = {
      id: 'step2',
      priority: 0,
      title: 'Revisión'
    } as WizardStepConfig;
    this.step2aConfig = {
      id: 'step2a',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 0,
      title: 'Resumen'
    } as WizardStepConfig;
    this.step2bConfig = {
      id: 'step2b',
      expandReviewDetails: true,
      nextEnabled: false,
      priority: 1,
      title: 'Guardar'
    } as WizardStepConfig;

    // Wizard
    this.wizardConfig = {
      loadingTitle: 'Cargando...',
      loadingSecondaryInfo: 'Información del usuario Sacpi|Next',
      title: 'Cambio de Contraseña',
      ready: false,
      sidebarStyleClass: 'sacpi-wizard-sidebar',
      stepStyleClass: 'sacpi-wizard-step'
    } as WizardConfig;

    setTimeout(() => {
      this.wizardConfig.ready = true;
    }, 1000);

    this.nextControl(false);
  }

  // Methods
  nextClicked($event: WizardEvent): void {
    //if ($event.step.config.id == 'step1a') {
    //   const userCopy = Object.assign(this.user || {}, this.formOld.value);
    //   this.dataService.users().search(userCopy).subscribe(
    //     result => {
    //       this.notification.success('Ingresando al sistema...', 'Informacion');
    //     },
    //     error => {
    //       this.notification.error('Usuario y/o Contraseña incorrecta', 'Alerta');
    //       this.loading = false;
    //       this.nextControl(false);
    //     }
    //   );
    // }
    // if ($event.step.config.id === 'step2b') {
    //   this.closeModal();
    // }
  }

  closeModal() {

  }
  startDeploy(): void {
    this.deployComplete = false;
    this.wizardConfig.done = true;

    // Simulate a delay
    setTimeout(() => {
      this.deployComplete = true;
    }, 2500);
  }

  stepChanged($event: WizardEvent) {
    let flatSteps = flattenWizardSteps(this.wizard);
    let currentStep = flatSteps.filter(step => step.config.id === $event.step.config.id);
    if (currentStep && currentStep.length > 0) {
      currentStep[0].config.nextEnabled = true;
    }
    if ($event.step.config.id === 'step2a') {
      this.wizardConfig.nextTitle = 'Create';
    } else if ($event.step.config.id === 'step2b') {
      this.wizardConfig.nextTitle = 'Close';
    } else {
      this.wizardConfig.nextTitle = 'Next >';
    }
  }

  nextControl(status: boolean): void {
    this.step1aConfig.nextEnabled = status;
    this.setNavAway(this.step1aConfig.nextEnabled);
  }
  nextControlB(status: boolean): void {
    this.step1bConfig.nextEnabled = status;
    this.setNavAway(this.step1bConfig.nextEnabled);
  }
  // Private

  private setNavAway(allow: boolean) {
    this.step1aConfig.allowNavAway = allow;

    this.step1Config.allowClickNav = allow;
    this.step1aConfig.allowClickNav = allow;
    this.step1bConfig.allowClickNav = allow;

    this.step2Config.allowClickNav = allow;
    this.step2aConfig.allowClickNav = allow;
    this.step2bConfig.allowClickNav = allow;
  }
}
function flattenWizardSteps(wizard: WizardComponent): WizardStep[] {
  let flatWizard: WizardStep[] = [];
  wizard.steps.forEach((step: WizardStepComponent) => {
    if (step.hasSubsteps) {
      step.steps.forEach(substep => {
        flatWizard.push(substep);
      });
    } else {
      flatWizard.push(step);
    }
  });
  return flatWizard;
}
