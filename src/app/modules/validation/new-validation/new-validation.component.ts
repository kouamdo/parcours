import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ValidationsService } from 'src/app/services/validations/validations.service';
import { IValidation } from 'src/app/modele/validation';
import {v4 as uuidv4} from 'uuid';
import { IRole } from 'src/app/modele/role';
import { RolesService } from 'src/app/services/roles/roles.service';

@Component({
  selector: 'app-new-validation',
  templateUrl: './new-validation.component.html',
  styleUrls: ['./new-validation.component.scss']
})
export class NewValidationComponent implements OnInit {
  validation : IValidation|undefined;
  forme: FormGroup;
  btnLibelle: string="Enregistrer";
  submitted: boolean=false;
  titre:string='';
  roles: IRole[]|undefined;
  initialDateCreation = new FormControl(new Date());
  initialDateModification = new FormControl(new Date());

  constructor(private formBuilder:FormBuilder, private validationservice:ValidationsService, private roleservices:RolesService, private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      code: ['', [Validators.required]],
      libelle: ['', [Validators.required]],
      typeVote: ['', [Validators.required]],
      dureeVote: [0, [Validators.required]],
      roleval: new FormControl<string | IRole>(''),
      etat: [true]
    })
  }

  ngOnInit(): void {
    let idValidation = this.infosPath.snapshot.paramMap.get('idValidation');
    this.getAllRoles().subscribe(valeurs => {
      this.roles = valeurs
    });

    this.forme.controls["roleval"].valueChanges.subscribe(
      value => {
        const titre = typeof value === 'string' ? value : value?.titre;
        if(titre != undefined && titre?.length >0){
          this.roleservices.getRolesBytitre(titre.toLowerCase() as string).subscribe(
            reponse => {
              this.roles = reponse;
            }
          )
        }
        else{
          this.getAllRoles().subscribe(
            (reponse) =>{
              this.roles=reponse
            }
          )
        }

      }
    );
    if((idValidation != null) && idValidation!==''){
      this.btnLibelle="Modifier";
      this.titre="Modifier validation";
      this.validationservice.getValidationById(idValidation).subscribe(x =>
        {
          this.validation = x;
          this.forme.setValue({
            code: this.validation.code,
            libelle: this.validation.libelle,
            etat: this.validation.etat,
            typeVote: this.validation.typeVote,
            dureeVote: this.validation.dureeVote,
            roleval: this.validation.role
          })
      });
    }
    
    /* this.services$ = this.getAllServices();
    this.titre=this.dataEnteteMenuService.dataEnteteMenu   */
  }

  get f(){
    return this.forme.controls;
  }

  displayFn(role: IRole): string {
    return role && role.titre ? role.titre : '';
  }

  private getAllRoles() {
    return this.roleservices.getAllRoles();
  }
  return(){
    this.router.navigate(['/list-validations']); 
  }

  onSubmit(validationInput:any){

    this.submitted=true;
    if(this.forme.invalid || !validationInput.roleval) return;

    let validationTemp : IValidation={
      id: uuidv4(),
      code: validationInput.code,
      libelle: validationInput.libelle,
      etat: validationInput.etat,
      typeVote: validationInput.typeVote,
      dureeVote: validationInput.dureeVote,
      role: validationInput.roleval,
      dateCreation: new Date
    }

    if(this.validation != undefined){
      validationTemp.id = this.validation.id,
      validationTemp.dateCreation = this.validation.dateCreation
    }
    this.validationservice.ajouterValidation(validationTemp).subscribe(
      object => {
        this.router.navigate(['/list-validations']);
      }
    )
  }

  compareItem(unite1: IRole, unite2: IRole) {
    return unite2 && unite1 ? unite2 == unite1 : false;
  }
}
