import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IPersonnel } from 'src/app/modele/personnel';
import { PersonnelsService } from 'src/app/services/personnels/personnels.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-new-personnel',
  templateUrl: './new-personnel.component.html',
  styleUrls: ['./new-personnel.component.css']
})
export class NewPersonnelComponent implements OnInit {
   [x: string]: any;

   //personnel$:Observable<personnel>=EMPTY;
   personnel : IPersonnel|undefined;
   forme: FormGroup;
   btnLibelle: string="Ajouter";
   titre: string="Ajouter un nouveau Personnel";
   submitted: boolean=false;
   initialDate = new FormControl(new Date());
   //TODO validation du formulaire. particulièrment les mail; les dates
   
   constructor(private formBuilder:FormBuilder, private personnelService:PersonnelsService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) { 
     this.forme =  this.formBuilder.group({
       nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
       prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
       sexe: [''],
       email: ['', [Validators.required, Validators.email, Validators.pattern(".+@.+\.{1}[a-z]{2,3}")]],
       //todo initialisation du composant à une date 
       dateNaissance: ['1980-01-01', Validators.required],
       telephone: ['']
     })    
   }
 
   ngOnInit() {
     let idPersonnel = this.infosPath.snapshot.paramMap.get('idPersonnel');
     console.log("idPersonnel:" + idPersonnel);
     if((idPersonnel != null) && idPersonnel!==''){
 
       this.btnLibelle="Modifier";
       this.titre="Personnel à Modifier";
       
       //trouver un autre moyen d'initialiser avec des valeurs
       this.personnelService.getPersonnelById(idPersonnel).subscribe(x =>
       {
         this.personnel = x; console.log(this.personnel);
         this.forme.setValue({
           nom: this.personnel?.nom,
           prenom: this.personnel?.prenom,
           sexe: this.personnel?.sexe,
           email: this.personnel?.email,
           dateNaissance: this.datePipe.transform(this.personnel?.dateNaissance,'yyyy-MM-dd'), // je change le format de la date de naissance pour pouvoir l'afficher dans mon input type date
           telephone: this.personnel?.telephone
         })
       });
     }    
   }
 
   get f(){
     return this.forme.controls;
   }
 
   onSubmit(personnelInput:any){
     this.submitted=true;
     //Todo la validation d'element non conforme passe
     if(this.forme.invalid) return;
 
     let personnelTemp : IPersonnel={
       id: uuidv4(),
       nom:personnelInput.nom,
       prenom:personnelInput.prenom,
       sexe:personnelInput.sexe,
       email:personnelInput.mail,
       telephone:personnelInput.telephone,
       dateNaissance:personnelInput.dateNaissance
     }
     personnelTemp.dateNaissance = this.initialDate.value!
     console.log("personnelTemp.dateNaissance est  :" + personnelTemp.dateNaissance);
 
     if(this.personnel != undefined){
       personnelTemp.id = this.personnel.id  
     }
     this.personnelService.ajouterPersonnel(personnelTemp).subscribe(
       object => {
        if (object) {
          console.log("error");
        } else {
         this.router.navigate(['/list-personnels']);
        }
       }
     )
   }

}

