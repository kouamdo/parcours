import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,MaxLengthValidator,MinLengthValidator,ReactiveFormsModule, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, isEmpty, Observable } from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import { DatePipe } from '@angular/common';
import { IRole } from 'src/app/modele/role';
import { RolesService } from 'src/app/services/roles/roles.service';

@Component({
  selector: 'app-new-role',
  templateUrl: './new-role.component.html',
  styleUrls: ['./new-role.component.scss']
})
export class NewRoleComponent implements OnInit {


  role : IRole |undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;
  //TODO validation du formulaire. particulièrment les mail
  constructor(private formBuilder:FormBuilder, private roleService:RolesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe){
    this.forme = this.formBuilder.group({
    titre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    etat: [true],
    description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
  })
  }

  ngOnInit() {
    let idRole= this.infosPath.snapshot.paramMap.get('idRole');
    console.log("idRole :" + idRole);
    if((idRole != null) && idRole!==''){

      this.btnLibelle="Modifier";
      //trouver un autre moyen d'initialiser avec des valeurs
      this.roleService.getRoleById(idRole).subscribe(x =>
      {
        this.role = x; console.log(this.role);
        this.forme.setValue({
          titre: this.role.titre,
          etat:this.role. etat,
          description: this.role.description,
          //dateCreation: this.datePipe.transform(this.role.dateCreation,'yyyy-MM-dd'),

        })
      });
    }
  }


  get f(){
    return this.forme.controls;
  }

  onSubmit(roleInput:any){
    this.submitted=true;
    //Todo la validation d'element non conforme passe
    if(this.forme.invalid) return;

    let roleTemp : IRole={
      id: uuidv4(),
      titre:roleInput.titre,
      description:roleInput.description,
      etat:roleInput.etat,
    }

    if(this.role != undefined){
      roleTemp.id = this.role.id
    }
    this.roleService.ajouterRole(roleTemp).subscribe(
      object => {
        this.router.navigate(['/list-roles']);
      }
    )
  }

}
