import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeUnite } from 'src/app/modele/type-unite';


import {v4 as uuidv4} from 'uuid';
import { MatTableDataSource } from '@angular/material/table';

import { EMPTY, Observable } from 'rxjs';
import { IPrecomvtqte } from 'src/app/modele/precomvtqte';
import { PrecomvtqtesService } from 'src/app/services/precomvtqtes/precomvtqtes.service';




@Component({
  selector: 'app-new-precomvtqte',
  templateUrl: './new-precomvtqte.component.html',
  styleUrls: ['./new-precomvtqte.component.scss']
})
export class NewPrecomvtqteComponent implements OnInit {

  precomvtqte : IPrecomvtqte|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;


  constructor(private formBuilder:FormBuilder,private precomvtqteService:PrecomvtqtesService,private servicePrecomvtqte:PrecomvtqtesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      quantiteMin: ['', [Validators.required]],
      quantiteMax: ['', [Validators.required]],
      montantMin: ['', [Validators.required]],
      montantMax: ['', [Validators.required]],
      type: ['',],
      fournisseur: ['',],
    })
  };

  ngOnInit(): void {
    let idPrecomvtqte = this.infosPath.snapshot.paramMap.get('idPrecomvtqte');
    if((idPrecomvtqte != null) && idPrecomvtqte!==''){
      this.btnLibelle="Modifier";
      this.precomvtqteService.getPrecomvtqteById(idPrecomvtqte).subscribe(x =>
        {
          this.precomvtqte = x; console.log(this.precomvtqte);
          this.precomvtqte.id = idPrecomvtqte!,
          this.forme.setValue({
            libelle: this.precomvtqte?.libelle,
            quantiteMin: this.precomvtqte?. quantiteMin,
            quantiteMax: this.precomvtqte?.quantiteMax,
            montantMin: this.precomvtqte?.montantMin,
            montantMax: this.precomvtqte?. montantMax,
            type: this.precomvtqte?.type,
            fournisseur: this.precomvtqte?.fournisseur,
          })
      });
    }
  }
  get f(){
    return this.forme.controls;
  }



  onSubmit(precomvtqteInput:any){
    this.submitted=true;
    if(this.forme.invalid) return;
    let precomvtqteTemp : IPrecomvtqte={
      id: uuidv4(),
      libelle: precomvtqteInput.libelle,
      quantiteMin: precomvtqteInput.quantiteMin,
      quantiteMax: precomvtqteInput.quantiteMax,
      montantMin: precomvtqteInput.montantMin,
      montantMax: precomvtqteInput.montantMax,
      type: precomvtqteInput.type,
      fournisseur:precomvtqteInput.fournisseur,
      ressource: precomvtqteInput.ressource,
      famille: []
    }

    if(this.precomvtqte != undefined){
      precomvtqteTemp.id = this.precomvtqte.id
    }

    this.precomvtqteService.ajouterPrecomvtqte(precomvtqteTemp).subscribe(
      object => {
        this.router.navigate(['list-precomvtqtes']);
      },
      error =>{
        console.log(error)
      }
    )
  }
}
