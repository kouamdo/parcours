import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { TypeUnite } from 'src/app/modele/type-unite';

import {v4 as uuidv4} from 'uuid';
import { MatTableDataSource } from '@angular/material/table';
import { EMPTY, Observable, single } from 'rxjs';

import { PrecomvtsService } from 'src/app/services/precomvts/precomvts.service';
import { IPrecomvt } from 'src/app/modele/precomvt';
import { IRessource } from 'src/app/modele/ressource';
import { IFamille } from 'src/app/modele/famille';
import { Unites } from 'src/app/modele/unites';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import { IPrecomvtqte } from 'src/app/modele/precomvtqte';
import { TypeMvt } from 'src/app/modele/type-mvt';
import { PrecomvtqtesService } from 'src/app/services/precomvtqtes/precomvtqtes.service';
//import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { IDropdownSettings} from 'ng-multiselect-dropdown/multiselect.model';
import { IService } from 'src/app/modele/service';
import { FamillesService } from 'src/app/services/familles/familles.service';

@Component({
  selector: 'app-new-precomvt',
  templateUrl: './new-precomvt.component.html',
  styleUrls: ['./new-precomvt.component.scss']
})

export class NewPrecomvtComponent implements OnInit {


  precomvt : IPrecomvt|undefined;
  forme: FormGroup;
  btnLibelle: string="Enregistrer";
  submitted: boolean=false;
  steps:any =1;
  btnRessource: string="Ressource";
  precomvts$:Observable<IRessource>=EMPTY;
  myControl = new FormControl<string | IRessource>('');
  filteredOptions: IRessource[] | undefined;
  dataSource = new MatTableDataSource<IRessource>();
  famille$:Observable<IFamille[]>=EMPTY;
  typeEchange!: TypeMvt;
  idFamille : string = "";

  Laressource: IRessource = {
    id: '',
    libelle: '',
    etat:true,
    quantite: 0,
    prix: 0,
    unite:Unites.litre,
    famille:{
      id: '',
      libelle: '',
      description: '',
      etat: ''
    },
    caracteristique:'',
  };
  famille:IFamille = {
    id: '',
    libelle: '',
    description: '',
    etat: ''
  };

  precomvtqte : IPrecomvtqte = {
    id:'',
    libelle:'',
    quantiteMin:0,
    quantiteMax:0,
    montantMin:0,
    montantMax:0,
    type:this. typeEchange,
    fournisseur:'',
    ressource:this. Laressource,
    famille:[],
  }

  dropdownData : any [] = [];
  settings: IDropdownSettings = {};
  selectedItems: any[] = [];

  dataFamille : IFamille[] = [];
  dataSourceFamilleResultat = new MatTableDataSource<IFamille>();
  _famille :  FormArray | undefined;
  dataSourceRessource: any;
  dataprecomvtqte: IPrecomvtqte[] = [];
  dataSourceprecomvtqteResultat= new MatTableDataSource<IPrecomvtqte>();

  @ViewChild(FormGroupDirective)
  formDirective!: FormGroupDirective;

  constructor(private formBuilder:FormBuilder,private serviceFamille:FamillesService,private precomvtqteService:PrecomvtqtesService ,private ressourceService:RessourcesService ,private precomvtService:PrecomvtsService,private serviceRessource:RessourcesService,private servicePrecomvt:PrecomvtsService,private servicePrecomvtqte:PrecomvtqtesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      _famille :  new FormArray([]),
      libelle: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      etat: [ ],
      type: [ ],
      assignerFamilles:formBuilder.group({
      famille : [],
      quantiteMin:new FormControl(),
      quantiteMax:new FormControl(),
      montantMin:new FormControl(),
      montantMax:new FormControl(),
      fournisseur:new FormControl(),
    }),
    assignerRessource:formBuilder.group({
      ressource:new FormControl(),
      quantiteMin:new FormControl(),
      quantiteMax:new FormControl(),
      montantMin:new FormControl(),
      montantMax:new FormControl()
    })
    })
  };
  ngOnInit(): void {
    this.getAllRessources().subscribe(valeurs => {
      this.dataSource.data = valeurs;
    });

//debut this famille
this.famille$ = this.getAllFamilles();
this.getAllRessources().subscribe(valeurs => {
  this.dataSourceRessource.data = valeurs;
});

//fin this famille

 //let idprecomvt debut
 let idPrecomvt = this.infosPath.snapshot.paramMap.get('idPrecomvt');
    if((idPrecomvt != null) && idPrecomvt!==''){
      //this.btnLibelle="Modifier";
      //this.titre="Document à Modifier";
      this.servicePrecomvt.getPrecomvtById(idPrecomvt).subscribe(x =>
      {
        this.precomvt = x; console.log(this.precomvt);
        this.forme.setValue({
        libelle:this.precomvt.libelle,
        etat:this.precomvt.etat,
        type:this.precomvt.type,
        precomvtqte:this.precomvt.precomvtqte,
        })
      });
    }


//let idprecomvt fin


    this.myControl.valueChanges.subscribe(
      value => {
        const libelle = typeof value === 'string' ? value : value?.libelle;
        if(libelle != undefined && libelle?.length >0){
          this.serviceRessource.getRessourcesByLibelle(libelle.toLowerCase() as string).subscribe(
            reponse => {
              this.filteredOptions = reponse;
            }
          )
        }
        else{
          this.filteredOptions = [];
        }

      }
    );

  }
//oncheckdebut
onCheckFamilleChange(event: any) {
    const _familles = (this.forme.controls ['_familles'] as FormArray);
    if (event.target.checked) {
      _familles.push(new FormControl(event.target.value));
      this.ajoutSelectionFamille(event.target.value);

    } else {
      const index = _familles.controls
      .findIndex(x => x.value === event.target.value);
      _familles.removeAt(index);
      this.dataFamille.splice(index,1);
    }
      this._famille = _familles;
      console.log(this._famille.value);
  }
  //TODO mise en cache
  ajoutSelectionFamille(value: any) {
    this.serviceFamille.getFamilleById(value).subscribe(
      object => {
        this.dataFamille.push(object);
      }
    )
  }
  //Tout selectionner début

   //Tout selectionner fin

  getFamilleId(idFamille: string) {
    this.idFamille = idFamille
  }



//oncheckfin

 get f(){
      return this.forme.controls;
    }

private getAllFamilles(){
      return this.serviceFamille.getAllFamilles();
    }
//debut stepper
    next(){
      this.steps= this.steps + 1;
    }

    back(){
      this.steps= this.steps - 1;
    }
 //fin stepper
 getIdRessource(id_ressource : string){

  this.serviceRessource.getRessourceById(id_ressource).subscribe(
    ressource =>{
      this.Laressource = ressource
    }
  )
}
 //fonction onSubmit debut
onSubmit(precomvtInput:any){
  //this.steps= this.steps +1;
// console.warn(this.forme.value);
this.submitted=true;
if(this.forme.invalid) return;
let precomvtTemp : IPrecomvt={
    id: uuidv4(),
    libelle:precomvtInput.libelle,
    etat:precomvtInput.etat,
    type:precomvtInput.type,
    precomvtqte:[],
  }
  console.log("Form Submitted!", this.forme.value);
  this.formDirective.resetForm();
  precomvtTemp.precomvtqte = this.dataprecomvtqte;
  this.dataSourceprecomvtqteResultat.data.forEach(
    a => precomvtTemp.precomvtqte.push(a)
  )
  this.servicePrecomvt.ajouterPrecomvt(precomvtTemp).subscribe(
    object => {
      this.router.navigate(['/list-precomvts']);
    }
  )
}
 //fonction onSubmit fin

 private getAllRessources(){
  return this.serviceRessource.getAllRessources();
   }
displayFn(ressource: IRessource): string {
 return ressource && ressource.libelle ? ressource.libelle : '';
  }
 public rechercherListingRessource(option: IRessource){
 this.serviceRessource.getRessourcesByLibelle(option.libelle.toLowerCase()).subscribe(
   valeurs => {this.dataSource.data = valeurs;}
 )
}
 //fonction valPrecomvtqte debut
 valPrecomvtqte(precomvtqteInput:any){
  this.submitted=true;
  if(this.forme.invalid) return;
  let precomvtqteTemp : IPrecomvtqte={
    id: uuidv4(),
    libelle: precomvtqteInput.libelle,
    //etat: precomvtqteInput.etat,
    type: precomvtqteInput.type,
    ressource: this.Laressource,
    fournisseur:precomvtqteInput.fournisseur,
    famille:[],
    quantiteMin:precomvtqteInput.quantiteMin,
    quantiteMax:precomvtqteInput.quantiteMax,
    montantMin:precomvtqteInput.montantMin,
    montantMax:precomvtqteInput.montantMax,
  }

  if(this.precomvtqte != undefined){
    precomvtqteTemp.id = this.precomvtqte.id
  }
  precomvtqteTemp.ressource = this.Laressource
 console.log('voici la ressource de cette ressource : ', precomvtqteTemp.ressource)
 console.log('valeur precomvtqte: ', precomvtqteTemp)
    }
 //fonction valPrecomvtqte fin
  }
