import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { TypeTicket } from 'src/app/modele/type-ticket';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import {v4 as uuidv4} from 'uuid';

@Component({
  selector: 'app-new-attribut',
  templateUrl: './new-attribut.component.html',
  styleUrls: ['./new-attribut.component.scss']
})
export class NewAttributComponent implements OnInit {
  attribut : IAttributs|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouvel attribut";
  submitted: boolean=false;

  typeInt = TypeTicket.Int;
  typeString = TypeTicket.String;
  typeDouble = TypeTicket.Double;
  typeFloat = TypeTicket.Float;
  typeBoolean = TypeTicket.Boolean;
  typeDate = TypeTicket.Date;

  initialDateCreation = new FormControl(new Date());
  initialDateModification = new FormControl(new Date());

  constructor(private formBuilder:FormBuilder, private attributService:AttributService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: ['false'],
      dateCreation: ['', [Validators.required]],
      dateModification: ['//'],
      type: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      obligatoire:[''],
      valeursParDefaut:['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
    })
  }

  ngOnInit(): void {
    let idAttribut = this.infosPath.snapshot.paramMap.get('idAttribut');
    if((idAttribut != null) && idAttribut!==''){
      this.btnLibelle="Modifier";
      this.titre="service à Modifier";
      this.attributService.getAttributById(idAttribut).subscribe(x =>
        {
          this.attribut = x;
          this.attribut.id = idAttribut!,
          this.forme.setValue({
            titre: this.attribut.titre,
            description: this.attribut.description,
            etat: this.attribut.etat,
            dateCreation: this.datePipe.transform(this.attribut.dateCreation,'yyyy-MM-dd'),
            dateModification: this.datePipe.transform(this.attribut.dateModification,'yyyy-MM-dd'),
            type: this.attribut.type,
            obligatoire: this.attribut.obligatoire,
            valeursParDefaut:this.attribut.valeursParDefaut
          })
      });
    }
  }

  get f(){
    return this.forme.controls;
  }

  onSubmit(attributInput:any){

    this.submitted=true;
    if(this.forme.invalid) return;

    let attributTemp : IAttributs={
      id:  uuidv4(),
      titre: attributInput.titre,
      description: attributInput.description,
      etat: attributInput.etat,
      dateCreation: attributInput.dateCreation,
      dateModification: attributInput.dateModification,
      ordre: 0,
      type: attributInput.type,
      obligatoire:  attributInput.obligatoire,
      valeursParDefaut:  attributInput.valeursParDefaut
    }
    attributTemp.dateCreation = this.initialDateCreation.value!
    attributTemp.dateModification = this.initialDateModification.value!

    if(this.attribut != undefined){
      attributTemp.id = this.attribut.id
    }

    this.attributService.ajouterAttribut(attributTemp).subscribe(
      object => {
        this.router.navigate(['/list-attributs']);
      },
     error =>{
        console.log(error)
      }
    )
  }
}
