import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeUnite } from 'src/app/modele/type-unite';

import {v4 as uuidv4} from 'uuid';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Observable } from 'rxjs';

import { PrecomvtsService } from 'src/app/services/precomvts/precomvts.service';
import { IPrecomvt } from 'src/app/modele/precomvt';

@Component({
  selector: 'app-new-precomvt',
  templateUrl: './new-precomvt.component.html',
  styleUrls: ['./new-precomvt.component.scss']
})
export class NewPrecomvtComponent implements OnInit {

  precomvt : IPrecomvt|undefined;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  submitted: boolean=false;


  constructor(private formBuilder:FormBuilder,private precomvtService:PrecomvtsService,private servicePrecomvt:PrecomvtsService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: [ '',],
      type: ['',],
      quantiteMin: ['', [Validators.required]],
      quantiteMax: ['', [Validators.required]],
      montantMin: ['', [Validators.required]],
      montantMax: ['', [Validators.required]],
    })
  };

  ngOnInit(): void {
    let idPrecomvt = this.infosPath.snapshot.paramMap.get('idPrecomvt');
    if((idPrecomvt != null) && idPrecomvt!==''){
      this.btnLibelle="Modifier";
      this.precomvtService.getPrecomvtById(idPrecomvt).subscribe(x =>
        {
          this.precomvt = x; console.log(this.precomvt);
          this.precomvt.id = idPrecomvt!,
          this.forme.setValue({
            libelle: this.precomvt?.libelle,
            etat: this.precomvt?.etat,
            type: this.precomvt?.type,
            quantiteMin: this.precomvt?. quantiteMin,
            quantiteMax: this.precomvt?.quantiteMax,
            montantMin: this.precomvt?.montantMin,
            montantMax: this.precomvt?. montantMax,
          })
      });
    }
  }
  get f(){
    return this.forme.controls;
  }



  onSubmit(precomvtInput:any){
    this.submitted=true;
    if(this.forme.invalid) return;
    let precomvtTemp : IPrecomvt={
      id: uuidv4(),
      libelle:precomvtInput.libelle,
      etat:precomvtInput.etat,
      type:precomvtInput.type,
      quantiteMin:precomvtInput.quantiteMin,
      quantiteMax:precomvtInput.quantiteMax,
      montantMin:precomvtInput.montantMin,
      montantMax:precomvtInput.montantMax,
    }

    if(this.precomvt != undefined){
      precomvtTemp.id = this.precomvt.id
    }

    this.precomvtService.ajouterPrecomvt(precomvtTemp).subscribe(
      object => {
        this.router.navigate(['list-precomvts']);
      },
      error =>{
        console.log(error)
      }
    )
  }

}
