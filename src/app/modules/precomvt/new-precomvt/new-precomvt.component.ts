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
import { IRessource } from 'src/app/modele/ressource';
import { IFamille } from 'src/app/modele/famille';
import { Unites } from 'src/app/modele/unites';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';

@Component({
  selector: 'app-new-precomvt',
  templateUrl: './new-precomvt.component.html',
  styleUrls: ['./new-precomvt.component.scss']
})
export class NewPrecomvtComponent implements OnInit {

forme=new FormGroup({
  libelle:new FormControl(''),
  etat:new FormControl(''),
  type:new FormControl(''),
famille:new FormGroup({
  quantiteMin:new FormControl(''),
  quantiteMax:new FormControl(''),
  montantMin:new FormControl(''),
  montantMax:new FormControl('')
  }),
ressource:new FormGroup({
  quantiteMin:new FormControl(''),
  quantiteMax:new FormControl(''),
  montantMin:new FormControl(''),
  montantMax:new FormControl('')
    })
});
btnLibelle: string="Ajouter";
steps:any =1;


constructor(){ }

  ngOnInit() {


  }
onSubmit() {
 this.steps= this.steps +1;
 console.log(this.forme.value);
}
back(){
  this.steps= this.steps -1;
}
}


