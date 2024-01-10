import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
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
  //titre: string="Ajouter attribut";
  submitted: boolean=false;
  titre:string='';
  typeAttribut : String[] = [];


  /*initialDateCreation = new FormControl(new Date());
  initialDateModification = new FormControl(new Date());*/
  constructor(private formBuilder:FormBuilder,private dataEnteteMenuService:DonneesEchangeService, private attributService:AttributService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      titre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: [true],
      type: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      valeursParDefaut:[''],
    })
  }

  ngOnInit(): void {
    this.attributService.getTypeAttribut().subscribe(t =>{
      this.typeAttribut = t.type;
    });
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
            type: this.attribut.type,
            valeursParDefaut:this.attribut.valeursParDefaut
          })
      });
    }
    this.titre=this.dataEnteteMenuService.dataEnteteMenu
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
      type: attributInput.type,
      valeursParDefaut: attributInput.valeursParDefaut
    }

    if(this.attribut != undefined){
      attributTemp.id = this.attribut.id
    }

    this.attributService.ajouterAttribut(attributTemp).subscribe(
      object => {
        this.router.navigate(['/list-attributs']);
      }
    )
  }
}
