import { Injectable } from '@angular/core';
import { ExpedientService } from './expedient.service';
import { RequirementService } from './requirement.service';
import { UserService } from './user.service';

@Injectable()
export class DataService {

  constructor(
    private expedientService: ExpedientService,
    private requirementService: RequirementService,
    private userService: UserService
  ) { }

  expedients(): ExpedientService {
    return this.expedientService;
  }

  requeriments(): RequirementService {
    return this.requirementService;
  }
  users(): UserService {
    return this.userService;
  }
}