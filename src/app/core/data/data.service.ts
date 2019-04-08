import { FileService } from './file.service';
import { Injectable } from '@angular/core';
import { ExpedientService } from './expedient.service';
import { RequirementService } from './requirement.service';
import { UserService } from './user.service';
import { UnitCodeService } from './unit-code.service';
import { ProductService } from './product.service';
import { RequirementTypeService } from './requirement-type.service';

@Injectable()
export class DataService {

  constructor(
    private expedientService: ExpedientService,
    private requirementService: RequirementService,
    private userService: UserService,
    private unitCodeService: UnitCodeService,
    private productService: ProductService,
    private requirementtype: RequirementTypeService,
    private fileService : FileService
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

  products(): ProductService {
    return this.productService;
  }

  unitcodes(): UnitCodeService {
    return this.unitCodeService;
  }
  requerimenttype(): RequirementTypeService {
    return this.requirementtype;
  }

  files(): FileService {
    return this.fileService;
  }
}