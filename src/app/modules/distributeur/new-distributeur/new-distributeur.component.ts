import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup,MaxLengthValidator,MinLengthValidator,ReactiveFormsModule, Validators  } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, isEmpty, Observable } from 'rxjs';
import {v4 as uuidv4} from 'uuid';
import { DatePipe } from '@angular/common';
import { IDistributeur } from 'src/app/modele/distributeur';
import { DistributeursService } from 'src/app/services/distributeurs/distributeurs.service';

@Component({
  selector: 'app-new-distributeur',
  templateUrl: './new-distributeur.component.html',
  styleUrls: ['./new-distributeur.component.scss']
})
export class NewDistributeurComponent implements OnInit {

  distributeur : IDistributeur |undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;

  //TODO validation du formulaire. particulièrment les mail
  constructor(private formBuilder:FormBuilder, private distributeurService:DistributeursService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe){
    this.forme = this.formBuilder.group({
    raisonSocial: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    adresse: [''],
    telephone: [''],
    mail: ['', [Validators.required, Validators.email, Validators.pattern(".+@.+\.{1}[a-z]{2,3}")]],
  })
  }

  ngOnInit() {
    let idDistributeur = this.infosPath.snapshot.paramMap.get('idDistributeur');
    console.log("idDistributeur :" + idDistributeur);
    if((idDistributeur != null) && idDistributeur!==''){

      this.btnLibelle="Modifier";


      //trouver un autre moyen d'initialiser avec des valeurs
      this.distributeurService.getDistributeurById(idDistributeur).subscribe(x =>
      {
        this.distributeur = x; console.log(this.distributeur);
        this.forme.setValue({
          raisonSocial: this.distributeur.raisonSocial,
          adresse: this.distributeur.adresse,
          telephone: this.distributeur.telephone,
          mail: this.distributeur.mail,

        })
      });
    }
  }


  get f(){
    return this.forme.controls;
  }

  onSubmit(distributeurInput:any){
    this.submitted=true;
    //Todo la validation d'element non conforme passe
    if(this.forme.invalid) return;

    let distributeurTemp : IDistributeur={
      id: uuidv4(),
      raisonSocial:distributeurInput.raisonSocial,
      adresse:distributeurInput.adresse,
      telephone:distributeurInput.telephone,
      mail:distributeurInput.mail,

    }

    if(this.distributeur != undefined){
      distributeurTemp.id = this.distributeur.id
    }
    this.distributeurService.ajouterDistributeur(distributeurTemp).subscribe(
      object => {
        this.router.navigate(['/list-distributeurs']);
      }
    )
  }
}
