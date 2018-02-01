import { Injectable } from '@angular/core';
import { ExpedientService } from './expedient.service';
import { RequirementService } from './requirement.service';
import { UserService } from './user.service';
import { UnitCodeService } from './unit-code.service';
import { ProductService } from './product.service';

@Injectable()
export class DataService {

  constructor(
    private expedientService: ExpedientService,
    private requirementService: RequirementService,
    private userService: UserService,
    private unitCodeService:UnitCodeService,
    private productService:ProductService
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

  products():ProductService{
    return this.productService;
  }

  unitcodes():UnitCodeService{
    return this.unitCodeService;
  }
}