import { Component, OnInit, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import {  FormBuilder, FormControl, FormGroup, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import {MatSelectModule} from '@angular/material/select';
import {MatFormFieldModule} from '@angular/material/form-field';
import {v4 as uuidv4} from 'uuid';
import { elementAt, EMPTY, map, Observable, single } from 'rxjs';

import { PrecoMvtsService } from 'src/app/services/precomvts/precomvts.service';
import { IPrecoMvt } from 'src/app/modele/precomvt';
import { IRessource } from 'src/app/modele/ressource';
import { IFamille } from 'src/app/modele/famille';
import { RessourcesService } from 'src/app/services/ressources/ressources.service';
import { FamillesService } from 'src/app/services/familles/familles.service';
import { IPrecoMvtQte } from 'src/app/modele/precomvtqte';
import { TypeMvt } from 'src/app/modele/type-mvt';
import { ErrorStateMatcher, ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { IDistributeur } from 'src/app/modele/distributeur';
import { DistributeursService } from 'src/app/services/distributeurs/distributeurs.service';

@Component({
  selector: 'app-new-precomvt',
  templateUrl: './new-precomvt.component.html',
  styleUrls: ['./new-precomvt.component.scss'],
})

export class NewPrecomvtComponent implements OnInit {


  //precomvt : IPrecoMvt|undefined;
  forme: FormGroup;
  submitted: boolean=false;
  //permet d'identifier la section du formulaire à ouvrir
  steps:any =1;

 // myControl = new FormControl<string | IRessource>('');
  filteredOptions: IRessource[] | undefined;
  distributeurs$:Observable<IDistributeur[]>=EMPTY;
  familles$:Observable<IFamille[]>=EMPTY;
  typeMvt: string[] = [TypeMvt.Ajout,TypeMvt.Neutre,TypeMvt.Reduire];
  //famille = new FormControl<string | IFamille[]>('');

 //représente l'ensemble des éléments de précoMvtQte en cours de création
 eltsPreco : IPrecoMvt[] = [];
 eltsPrecoMvtQte : IPrecoMvtQte[] = [];
 //précise l'index de eltPreco qu'on souhaite modifier
 indexModification = -1;

  precoMvt : IPrecoMvt ={
  id: "uuidv4()",
  libelle: "",
  etat: true,
    type: TypeMvt.Ajout,
  precomvtqte:[]
 };
 idPrecoMvt: string = '';

 //submitted=false;
 tabError : Map<String,String> = new Map();

 @ViewChild(FormGroupDirective)

  formDirective!: FormGroupDirective;
  //settings: { idField: string; textField: string; allowSearchFilter: boolean; } | undefined;
  precoMvtTmp=  this.eltsPreco[0]
  PrecoMvt:IPrecoMvt={
    id: '',
    libelle:'',
    type: '',
    etat:false,
    precomvtqte:[],
  }

  constructor(private formBuilder:FormBuilder,private serviceFamille:FamillesService,private serviceDistributeur:DistributeursService,private ressourceService:RessourcesService ,private precoMvtService:PrecoMvtsService,private serviceRessource:RessourcesService,private router:Router, private infosPath:ActivatedRoute, private datePipe: DatePipe) {
    this.forme = this.formBuilder.group({
      libelle: new FormControl(),
      etat: new FormControl(),
      type: new FormControl(),
      ressource: new FormControl<string | IRessource>(''),
      quantiteMin:new FormControl(),
      quantiteMax:new FormControl(),
      montantMin:new FormControl(),
      montantMax:new FormControl(),
      famille :  new FormControl<string | IFamille[]>(''),
      //fournisseur:new FormControl(),
      distributeur:new FormControl<string | IDistributeur[]>(''),
    });
 }

  ngOnInit(): void {

    this.familles$ = this.getAllFamilles();
    this.distributeurs$ = this.getAllDistributeurs();
    //code autocompletion qui retourne les éléments du type déclaré
    //this.myControl.valueChanges.subscribe(
      this.forme.controls["ressource"].valueChanges.subscribe(
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
    let idPrecoMvt = this.infosPath.snapshot.paramMap.get('idPrecoMvt');
    if (idPrecoMvt != null && idPrecoMvt !== '') {
      this.precoMvtService.getPrecomvtById(idPrecoMvt).subscribe(
        PrecoMvtCourant =>{
          //premier elt du tableau
          this.eltsPreco= []
          let precoMvtTemp : IPrecoMvt ={
            id: PrecoMvtCourant.id,
            libelle:"Libelle : " + PrecoMvtCourant.libelle,
            etat: PrecoMvtCourant.etat,
            type: PrecoMvtCourant.type,
            precomvtqte:[]
           };
           this.eltsPreco.push(precoMvtTemp)

           PrecoMvtCourant.precomvtqte.forEach(

        element => {
          let precoMvtTemp : IPrecoMvt ={
            id: "",
            libelle: "",
            etat: true,
              type: TypeMvt.Ajout,
            precomvtqte:[]
           };
           precoMvtTemp.precomvtqte.push(element)
          if (element.ressource != undefined && element.ressource != null ){
            let rsrce  = " Ressource :  ";
              const ressource = element.ressource!.libelle;
              rsrce = rsrce + ressource

            precoMvtTemp.libelle = rsrce
            this.eltsPreco.push(precoMvtTemp)
          }
         else if (element.famille != null && element.famille.length>0 ){
            let libel = "Familles : ";
            for (let index = 0; index < element.famille!.length; index++) {
              libel += element.famille![index].libelle;

            }
            precoMvtTemp.libelle = libel
            this.eltsPreco.push(precoMvtTemp)
        }



      });
        }
      )
    }
  }

get formeControls():any{
  return this.forme['controls'];
}

 get f(){
      return this.forme.controls;
    }

private getAllFamilles(){
      return this.serviceFamille.getAllFamilles();
    }

private getAllDistributeurs(){
      return this.serviceDistributeur.getAllDistributeurs();
    }

 /**
  *
  */
 enregistrerPreco(){
  let  precomvtTemp : IPrecoMvt={
    id: uuidv4(),
    libelle:this.eltsPreco[0].libelle,
    etat:this.eltsPreco[0].etat,
    type:this.eltsPreco[0].type,
    precomvtqte:[],
  }
 if(this.PrecoMvt.id != ''){
  precomvtTemp.id = this.PrecoMvt.id
}
this.eltsPreco.forEach
     (valeur =>{
      precomvtTemp.precomvtqte.push(valeur.precomvtqte[0])

});
console.log (precomvtTemp)
this.precoMvtService.ajouterPrecomvt(precomvtTemp).subscribe(
  object => {
    this.router.navigate(['list-precomvts']);
}
)
  }
 //fonction onSubmit fin

 //début fonction afficher message d'erreur
 validerControleStep(etape:number, valeurs:any){
  let controleVerif = true;
  //controle sur l'étape courante
  if(this.steps == 1){
    let valLibelle : string = this.forme.controls["libelle"].value;
    let valLibel = valLibelle
    if(valLibelle!=null && valLibelle.length>0)
       valLibel = valLibelle.trimStart().trimEnd();
    if((valLibel==null || valLibel == '' || valLibel.length < 2)){
      controleVerif = false;
      this.tabError.set("libelle","Taille doit etre supérieure à 2");
    }
    let valType : string = this.forme.controls["type"].value;
    //let valType = valType.trimStart().trimEnd();
    if((valType == null || valType == '')){
      controleVerif = false;
      this.tabError.set("type", "Le type doit avoir une valeur");
    }

  }else{
      if(this.steps == 2){
        let valFamille : string[] = this.forme.controls["famille"].value;

        if((valFamille == null || valFamille.length == 0)){
          controleVerif = false;
          this.tabError.set("famille","Une famille au moins doit être selectionnée");
        }
      }
      else if(this.steps == 3){
          let valRessource : string = this.forme.controls["ressource"].value;

          if((valRessource==null || valRessource == '' || valRessource.length < 0)){
            controleVerif = false;
            this.tabError.set("ressource","Une ressource est obligatoire");
          }
      }
    //controle commun ie montantMin et MontantMax
      if(this.steps == 2 || this.steps == 3){
      let valMontantMin : number = this.forme.controls["montantMin"].value;

      if(valMontantMin== null || valMontantMin < 0){
        controleVerif = false;
        this.tabError.set("montantMin","Montant Min est obligatoire");
      }
      let valMontantMax : number = this.forme.controls["montantMax"].value;

      if(valMontantMax==null || valMontantMax< 0){
        controleVerif = false;
        this.tabError.set("montantMax","Montant Max est  obligatoire");
      }
      if(valMontantMin > valMontantMax){
        controleVerif = false;
        this.tabError.set("montantMinMax","Montant Max doit être supérieur au montant Min");
      }

     let valQuantiteMin : number = this.forme.controls["quantiteMin"].value;

     if(valQuantiteMin == null || valQuantiteMin< 0){
       controleVerif = false;
       this.tabError.set("quantiteMin","Quantite Min est obligatoire");
     }

     let valQuantiteMax : number = this.forme.controls["quantiteMax"].value;

     if(valQuantiteMax==null || valQuantiteMax< 0){
       controleVerif = false;
       this.tabError.set("quantiteMax","Quantite Max est obligatoire");
     }
     if(valQuantiteMin > valQuantiteMax ){
      controleVerif = false;
      this.tabError.set("quantiteMinMax","Quantite Max doit être supérieur à Quantite Min");
    }
      }
  }
  if(controleVerif){
    this.steps = etape;
    this.enregistrerValeurPrecomvtqte(valeurs);
  }
}
 //début fonction afficher message d'erreur

//Suppression d'un element dans le boitier début
supprimerElt(element: IPrecoMvt){
this.eltsPreco.forEach((value, index) =>{
  if(value == element)
  this.eltsPreco.splice(index,1)
});
}
//Suppression d'un element dans le boitier fin

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
  //console.log (this.submitted=true);
  //this.submitted=true;
  //if(this.forme.invalid) return;
  //alert("ok");
  //this.submitted=true;
  //if(this.forme.invalid) return;
  //alert("ko")
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
      //this.forme.controls["fournisseur"].setValue(precoTmp.precomvtqte[0].fournisseur);
      this.forme.controls["distributeur"].setValue(precoTmp.precomvtqte[0].distributeur);
    }
    else if(precoTmp.precomvtqte[0].famille!= undefined && precoTmp.precomvtqte[0].famille!=null && precoTmp.precomvtqte[0].famille.length>0){
      this.steps = 2;
      this.forme.controls["famille"].setValue(precoTmp.precomvtqte[0].famille);
      //this.famille.setValue(precoTmp.precomvtqte[0].famille);
      //this.forme.controls["id"].setValue(precoTmp.precomvtqte[0].id);
      this.forme.controls["montantMax"].setValue(precoTmp.precomvtqte[0].montantMax);
      this.forme.controls["montantMin"].setValue(precoTmp.precomvtqte[0].montantMin);
      this.forme.controls["quantiteMax"].setValue(precoTmp.precomvtqte[0].quantiteMax);
      this.forme.controls["quantiteMin"].setValue(precoTmp.precomvtqte[0].quantiteMin);
      //TODO bug de l'affichage au premier clic. C'est le second qui affiche la bonne valeur
      //this.forme.controls["fournisseur"].setValue(precoTmp.precomvtqte[0].fournisseur);
      this.forme.controls["distributeur"].setValue(precoTmp.precomvtqte[0].distributeur);
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
      //fournisseur: precomvtInput.fournisseur,
      distributeur: precomvtInput.distributeur
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
      //fournisseur: precomvtInput.fournisseur,
      distributeur: precomvtInput.distributeur
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
     // fournisseur: "DCD",
      distributeur: precomvtInput.distributeur
    };
    let precomvtTemp : IPrecoMvt={
      id: uuidv4(),
      libelle:"Libelle : "+ precomvtInput.libelle,
      etat: precomvtInput.etat,
      type: precomvtInput.type,
      precomvtqte:[]
    }
    precomvtTemp.precomvtqte.push(premvtqte);
    return precomvtTemp;
  }
  compareItem(famille1: IFamille, famille2: IFamille) {
    return famille2 && famille1 ? famille2.id === famille1.id : famille2 === famille1;
}
  compareItem1(distributeur1: IDistributeur, distributeur2: IDistributeur) {
  return distributeur2 && distributeur1 ? distributeur2.id === distributeur1.id : distributeur2 === distributeur1;
}
}
