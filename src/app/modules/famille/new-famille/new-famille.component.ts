import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormGroup, FormBuilder, MaxLengthValidator,MinLengthValidator,ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EMPTY, Observable, isEmpty } from 'rxjs';
import { IService } from 'src/app/modele/service';
import { ServicesService } from 'src/app/services/services/services.service';
import { IFamille } from 'src/app/modele/famille';
import { FamillesService } from 'src/app/services/familles/familles.service';




@Component({
  selector: 'app-new-famille',
  templateUrl: './new-famille.component.html',
  styleUrls: ['./new-famille.component.scss']
})
export class NewFamilleComponent implements OnInit {
  //patient$:Observable<patientient>=EMPTY;
  famille : IFamille|undefined;
  forme: FormGroup;
  btnLibelle: string="Envoyer";
  submitted: boolean=false;

  //TODO validation du formulaire. particulièrment les mail; les dates

  constructor(private formBuilder:FormBuilder, private familleService:FamillesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme =  this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: ['',[Validators.required, Validators.minLength(2), Validators.maxLength(50)]],

    })

  }

  ngOnInit() {
    let idFamille = this.infosPath.snapshot.paramMap.get('idFamille');
    console.log("idFamille :" + idFamille);
    if((idFamille != null) && idFamille!==''){

      this.btnLibelle="Envoyer";


      //trouver un autre moyen d'initialiser avec des valeurs
      this.familleService.getFamilleById(idFamille).subscribe(x =>
        {
          this.famille = x; console.log(this.famille);
          this.forme.setValue({
            libelle: this.famille.libelle,
            description: this.famille.description,
            etat: this.famille.etat,

          })
        });
    }

  }

  get f(){
    return this.forme.controls;
  }

  onSubmit(patientInput:any){
    this.submitted=true;
    //Todo la validation d'element non conforme passe
    if(this.forme.invalid) return;

}
}
