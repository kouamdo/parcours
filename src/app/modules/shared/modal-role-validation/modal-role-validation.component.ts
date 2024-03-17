import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IRole } from 'src/app/modele/role';
import { IValidation } from 'src/app/modele/validation';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { RolesService } from 'src/app/services/roles/roles.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-modal-role-validation',
  templateUrl: './modal-role-validation.component.html',
  styleUrls: ['./modal-role-validation.component.scss']
})
export class ModalRoleValidationComponent implements OnInit{

  myControl = new FormControl<string | IRole>('');
  filteredOptions: IRole[] | undefined;
  
  constructor(
    private _liveAnnouncer: LiveAnnouncer,
    private router:Router,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private serviceRole:RolesService,
    private donneeRoleValidationService:DonneesEchangeService
  ) {}
  
  ngOnInit(): void {

    this.getAllRoles().subscribe(valeurs => {
      this.filteredOptions = valeurs
    });

    this.myControl.valueChanges.subscribe(
      value => {
        const name = typeof value === 'string' ? value : value?.titre;
        if(name != undefined && name?.length >0){
          this.serviceRole.getRolesBytitre(name.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.serviceRole.getAllRoles().subscribe(
            (reponse) =>{
              this.filteredOptions=reponse
            }
          )
        }

      }
    );
  }

  displayFn(user: IRole): string {
    return user && user.titre ? user.titre: '';
  }

  private getAllRoles(){
    return this.serviceRole.getAllRoles();
  }

  public rechercherListingRole(option: IRole){
    this.serviceRole.getRoleById(option.id).subscribe(
        valeurs => {
          let validationRole : IValidation = {
            id: '',
            libelle: 'validation ' + option.titre,
            code: uuidv4(),
            dateCreation: new Date(),
            etat: false,
            role: {
              id: '',
              titre: '',
              description: '',
              etat: false
            },
            typeVote: '',
            dureeVote: 0
          }
          this.donneeRoleValidationService.dataRoleValidation = validationRole
        }
    )
  }
}
