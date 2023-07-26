import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import {  FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {v4 as uuidv4} from 'uuid';
import { EMPTY, Observable, single } from 'rxjs';

import { PrecoMvtsService } from 'src/app/services/precomvts/precomvts.service';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { IRessource } from 'src/app/modele/ressource';
import { IFamille } from 'src/app/modele/famille';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import { FamillesService } from 'src/app/services/familles/familles.service';
import { IPrecoMvtQte } from 'src/app/modele/precomvtqte';
import { TypeMvt } from 'src/app/modele/type-mvt';

@Component({
  selector: 'app-new-precomvt',
  templateUrl: './new-precomvt.component.html',
  styleUrls: ['./new-precomvt.component.scss']
})

export class NewPrecomvtComponent implements OnInit {


  //precomvt : IPrecoMvt|undefined;
  forme: FormGroup;
  submitted: boolean=false;
  //permet d'identifier la section du formulaire à ouvrir
  steps:any =1;

  myControl = new FormControl<string | IRessource>('');
  filteredOptions: IRessource[] | undefined;

  familles$:Observable<IFamille[]>=EMPTY;
  typeMvt: string[] = [TypeMvt.Ajout,TypeMvt.Neutre,TypeMvt.Reduire];
  famille = new FormControl<string | IFamille[]>('');

 //représente l'ensemble des éléments de précoMvtQte en cours de création
 eltsPreco : IPrecoMvt[] = [];
 //précise l'index de eltPreco qu'on souhaite modifier
 indexModification = -1;

 precoMvtFinal : IPrecoMvt ={
  id: "uuidv4()",
  libelle: "",
  etat: true,
    type: TypeMvt.Ajout,
  precomvtqte:[]
 };


  @ViewChild(FormGroupDirective)
  formDirective!: FormGroupDirective;
  //settings: { idField: string; textField: string; allowSearchFilter: boolean; } | undefined;

  constructor(private formBuilder:FormBuilder,private serviceFamille:FamillesService,private ressourceService:RessourcesService ,private precoMvtService:PrecoMvtsService,private serviceRessource:RessourcesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      libelle: new FormControl(),
      etat: new FormControl(),
      type: new FormControl(),
      ressource: this.myControl,
      quantiteMin:new FormControl(),
      quantiteMax:new FormControl(),
      montantMin:new FormControl(),
      montantMax:new FormControl(),
      famille : this.famille,
      fournisseur:new FormControl()
    });

  }

  ngOnInit(): void {

    this.familles$ = this.getAllFamilles();

    //code autocompletion qui retourne les éléments du type déclaré
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


 get f(){
      return this.forme.controls;
    }

private getAllFamilles(){
      return this.serviceFamille.getAllFamilles();
    }

 //fonction onSubmit debut
onSubmit(precomvtInput:any){
this.submitted=true;
if(this.forme.invalid) return;

}
 //fonction onSubmit fin


displayFn(ressource: IRessource): string {
 return ressource && ressource.libelle ? ressource.libelle : '';
  }

reset():void{
  this.forme.reset();
  //reset de l'index pour laisser le choix à l'utilisateur de remplir des nouvelles precoMvtQte
  this.indexModification = -1;
}


 /**
  * Permet de sauvegarder l'enchainement des precoMvtQte chacune dans une precoMvt
  * @param precomvtqteInput
  * @returns
  */
  enregistrerValeurPrecomvtqte(precomvtInput:any){
  //this.submitted=true;
  //if(this.forme.invalid) return;
  console.log("enregistrerValeurPrecomvtqte indexModification : " + this.indexModification)
  //sauvegarde des valeurs de precoMvt <=> premier ecran
  if(precomvtInput.libelle != null && precomvtInput.libelle!=""){
    if(this.indexModification==-1) //si vaut -1 alors création
      this.eltsPreco.push(this.creerPrecoMvtQteLibelle(precomvtInput));
    else //si différent de -1 alors modification
     this.eltsPreco[this.indexModification]= this.creerPrecoMvtQteLibelle(precomvtInput);

  }else if (precomvtInput.ressource != null && precomvtInput.ressource !=""){
    if(this.indexModification==-1)
      this.eltsPreco.push(this.creerPrecoMvtQteRessource(precomvtInput));
    else
     this.eltsPreco[this.indexModification]= this.creerPrecoMvtQteRessource(precomvtInput);

  }else if(precomvtInput.famille != null && precomvtInput.famille.length>0) {
    if(this.indexModification==-1)
      this.eltsPreco.push(this.creerPrecoMvtQteFamille(precomvtInput));
    else
    this.eltsPreco[this.indexModification]=this.creerPrecoMvtQteFamille(precomvtInput);
  }

  this.reset();
}//fonction valPrecomvtqte fin

  /**
   * retrouve l'index du tableau eltPreco pour l'afficher dans la partie gauche
   * @param i
   */
  chargerValeurPrecoMvt(i:number):void{
    //on reset pour éviter d'écraser les autres step car on teste l'existence du libelle
    this.reset();

    this.indexModification = i;
    console.log("chargerValeurPrecoMvt indexModification : " + this.indexModification)
    let precoTmp = this.eltsPreco[i];
    //l'index 0 correspond toujours au premier écran de precoMvt
    if(i==0){
      this.steps = 1;
      this.forme.controls["libelle"].setValue(precoTmp.libelle);
      this.forme.controls["etat"].setValue(precoTmp.etat);
      this.forme.controls["type"].setValue(precoTmp.type);
      //ajouter un unique champ caché id pour conserver l'id en cas modification
      //this.forme.controls["id"].setValue(precoTmp.id);
    }
    //si ressource absente de précoMvtQt alors par élimitation c'est une famille
    else if(precoTmp.precomvtqte[0].ressource!= undefined && precoTmp.precomvtqte[0].ressource!=null){
      this.steps = 3;
      this.forme.controls["ressource"].setValue(precoTmp.precomvtqte[0].ressource);
      //this.forme.controls["id"].setValue(precoTmp.precomvtqte[0].id);
      this.forme.controls["montantMax"].setValue(precoTmp.precomvtqte[0].montantMax);
      this.forme.controls["montantMin"].setValue(precoTmp.precomvtqte[0].montantMin);
      this.forme.controls["quantiteMax"].setValue(precoTmp.precomvtqte[0].quantiteMax);
      this.forme.controls["quantiteMin"].setValue(precoTmp.precomvtqte[0].quantiteMin);
      //TODO bug de l'affichage au premier clic. C'est le second qui affiche la bonne valeur
      this.forme.controls["fournisseur"].setValue(precoTmp.precomvtqte[0].fournisseur);
    }
    else if(precoTmp.precomvtqte[0].famille!= undefined && precoTmp.precomvtqte[0].famille!=null && precoTmp.precomvtqte[0].famille.length>0){
      this.steps = 2;
      this.forme.controls["famille"].setValue(precoTmp.precomvtqte[0].famille);
      this.famille.setValue(precoTmp.precomvtqte[0].famille);
      //this.forme.controls["id"].setValue(precoTmp.precomvtqte[0].id);
      this.forme.controls["montantMax"].setValue(precoTmp.precomvtqte[0].montantMax);
      this.forme.controls["montantMin"].setValue(precoTmp.precomvtqte[0].montantMin);
      this.forme.controls["quantiteMax"].setValue(precoTmp.precomvtqte[0].quantiteMax);
      this.forme.controls["quantiteMin"].setValue(precoTmp.precomvtqte[0].quantiteMin);
      //TODO bug de l'affichage au premier clic. C'est le second qui affiche la bonne valeur
      this.forme.controls["fournisseur"].setValue(precoTmp.precomvtqte[0].fournisseur);
    }
  }

  /**
   * a partir des inputs html on crée un occurrence de PrecoMvt
   * @param precomvtInput
   * @returns
   */
  creerPrecoMvtQteFamille(precomvtInput:any):IPrecoMvt{
    let premvtqte : IPrecoMvtQte={
      famille: precomvtInput.famille,
      quantiteMax: precomvtInput.quantiteMax,
      quantiteMin: precomvtInput.quantiteMin,
      montantMax: precomvtInput.montantMax,
      montantMin: precomvtInput.montantMin,
      id:"",
      fournisseur: precomvtInput.fournisseur
    }
    let libel = "Familles : ";
    for (let index = 0; index < precomvtInput.famille.length; index++) {
      const element = precomvtInput.famille[index];
      libel += element.libelle + ", "
    }
    let precomvtTemp : IPrecoMvt={
      id: uuidv4(),
      libelle: libel,
      etat: false,
      type: precomvtInput.TypeMvt,
      precomvtqte:[]
    }
    precomvtTemp.precomvtqte.push(premvtqte);
    return precomvtTemp;
  }
  /**
   * a partir des inputs html on crée un occurrence de PrecoMvt
   * uniquement pour le cas des ressources
   * @param precomvtInput
   * @returns
   */
   creerPrecoMvtQteRessource(precomvtInput:any):IPrecoMvt{
    let premvtqte : IPrecoMvtQte={
      ressource: precomvtInput.ressource,
      quantiteMax: precomvtInput.quantiteMax,
      quantiteMin: precomvtInput.quantiteMin,
      montantMax: precomvtInput.montantMax,
      montantMin: precomvtInput.montantMin,
      id:"",
      fournisseur: precomvtInput.fournisseur
    };
    let precomvtTemp : IPrecoMvt={
      id: uuidv4(),
      libelle: "Ressource : " + precomvtInput.ressource.libelle,
      etat: false,
      type: precomvtInput.TypeMvt,
      precomvtqte:[]
    }
    precomvtTemp.precomvtqte.push(premvtqte);
    return precomvtTemp;
  }

  /**
   * a partir des inputs html on crée un occurrence de PrecoMvt
   * uniquement pour le step 1 (premier ecran)
   * @param precomvtInput
   * @returns
   */
   creerPrecoMvtQteLibelle(precomvtInput:any):IPrecoMvt{
    let premvtqte : IPrecoMvtQte={
      ressource: undefined,
      quantiteMax: 0,
      quantiteMin: 0,
      montantMax: 0,
      montantMin: 0,
      id:"",
      fournisseur: "DCD"
    };
    let precomvtTemp : IPrecoMvt={
      id: uuidv4(),
      libelle: precomvtInput.libelle,
      etat: precomvtInput.etat,
      type: precomvtInput.type,
      precomvtqte:[]
    }
    precomvtTemp.precomvtqte.push(premvtqte);
    return precomvtTemp;
  }

}
