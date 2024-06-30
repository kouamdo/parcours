import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IPersonnel } from 'src/app/modele/personnel';
import { IUtilisateurs } from 'src/app/modele/utilisateurs';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { PersonnelsService } from 'src/app/services/personnels/personnels.service';
import { UtilisateurService } from 'src/app/services/utilisateurs/utilisateur.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-new-personnel',
  templateUrl: './new-personnel.component.html',
  styleUrls: ['./new-personnel.component.scss'],
})
export class NewPersonnelComponent implements OnInit {

   //personnel$:Observable<personnel>=EMPTY;
   personnel : IPersonnel|undefined;
   forme: FormGroup;
   btnLibelle: string="Ajouter";
   submitted: boolean=false;
   // Import the QRCodeModule
   qrCodeValue: string = '';
   titre:string='';
   constructor(private formBuilder:FormBuilder,private dataEnteteMenuService:DonneesEchangeService, private userService: UtilisateurService, private personnelService:PersonnelsService, private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
     this.forme =  this.formBuilder.group({
       nom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
       prenom: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
       sexe: ['', Validators.required],
       pwd: [''],
       email: ['', [Validators.required, Validators.email, Validators.pattern(".+@.+\.{1}[a-z]{2,3}")]],
       //todo initialisation du composant à une date
       dateNaissance: ['1980-01-01', Validators.required],
       dateEntree: ['2023-01-01', Validators.required],
       dateSortie: ['0000-00-00'],
       telephone: ['', Validators.required]
     })
   }

   ngOnInit() {
     let idPersonnel = this.infosPath.snapshot.paramMap.get('idPersonnel');
     if((idPersonnel != null) && idPersonnel!==''){

       this.btnLibelle="Modifier";
       this.titre="Personnel à Modifier";


       this.personnelService.getPersonnelById(idPersonnel).subscribe(x =>
       {
         this.personnel = x;
         this.forme.setValue({
           nom: this.personnel?.nom,
           prenom: this.personnel?.prenom,
           sexe: this.personnel?.sexe,
           email: this.personnel.email,
           dateNaissance: this.datePipe.transform(this.personnel?.dateNaissance,'yyyy-MM-dd'),
           dateEntree: this.datePipe.transform(this.personnel?.dateEntree,'yyyy-MM-dd'),
           dateSortie: this.datePipe.transform(this.personnel?.dateSortie,'yyyy-MM-dd'),
           telephone: this.personnel?.telephone
         })
       });
     }
   }

  get f() {
    return this.forme.controls;
  }

  onSubmit(personnelInput: any) {
    this.submitted = true;
    console.log("value form:", this.forme.value);
    
    if (this.forme.invalid) return;



    let personnelTemp: IPersonnel = {
      id: uuidv4(),
      nom: personnelInput.nom,
      prenom: personnelInput.prenom,
      sexe: personnelInput.sexe,
      email: personnelInput.email,
      telephone: personnelInput.telephone,
      dateNaissance: personnelInput.dateNaissance,
      dateEntree: personnelInput.dateEntree,
      dateSortie: personnelInput.dateSortie,
      qrCodeValue: personnelInput.qrCodeValue
    };

    let userTemp: IUtilisateurs = {
      id: uuidv4(),
      login: personnelTemp.email,
      passWord: personnelTemp.nom+"_"+personnelTemp.id,
      user: personnelTemp
    }

    if (this.personnel != undefined) {
      personnelTemp.id = this.personnel.id;
    }

    // Save personnel data
    this.personnelService
      .ajouterPersonnel(personnelTemp)
      .subscribe((object) => {
        this.userService.ajouterUser(userTemp);
        console.log("User create :", userTemp);
        this.router.navigate(['parcours/personnels/list-personnels']);
      });
  }
}
