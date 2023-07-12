import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { ICategorieAffichage } from 'src/app/modele/categorie-affichage';
import { ICategoriesAttributs } from 'src/app/modele/categories-attributs';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { CategorieAttributService } from 'src/app/services/categorie-attribut/categorie-attribut.service';
import { DocumentService } from 'src/app/services/documents/document.service';
import { TypeTicket } from "src/app/modele/type-ticket";
import {v4 as uuidv4} from 'uuid';
import { map } from 'rxjs';

@Component({
  selector: 'app-modal-categories',
  templateUrl: './modal-categories.component.html',
  styleUrls: ['./modal-categories.component.scss']
})
export class ModalCategoriesComponent implements OnInit {

  formeCategorieAttribut: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter une categorie";
  submitted: boolean=false;
  validation: boolean=false;

  // structure du tableau presentant les categories creees avec leurs attributs
  displayedCategoriesAttributsColumns: string[] = ['actions','nomCategorie', 'ordreCat', 'libelleAttribut', 'ordreAtrParCat']; 
  // structure du tableau presentant les choix des attributs lors de la creation des categories
  displayedCategoriesColumns: string[] = ['actions','titre', 'description', 'type', 'ordreAtrParCat'];  
  
  nomValide : boolean = false
  
  //tableau de listing des attributs a affecter a chaque categorie
  dataSourceAttributTemp = new MatTableDataSource<IAttributs>(); 
  
  categorieAttributs : ICategoriesAttributs = {
    id: '',
    nom: '',
    ordre: 0,
    listAttributs: []
  }
  attributTemp : IAttributs = {
    id: '',
    titre: '',
    description: '',
    etat: false,
    dateCreation: new Date,
    dateModification: new Date,
    ordre: 0,
    obligatoire: false,
    valeursParDefaut: '',
    type: TypeTicket.Int
  }

// tableau contenant les categories creees a partir du premier tableau de la modal
  TABLE_CATEGORIE_AFFICHAGE_TEMP: ICategorieAffichage[] = []; 
  tableResultatsCategoriesAffichage  = new MatTableDataSource<ICategorieAffichage>(this.TABLE_CATEGORIE_AFFICHAGE_TEMP);

  tableauAttributsTemp : IAttributs[] = []
  tableauIndexSelectionner = new Map(); 
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceCategorieAttribut:CategorieAttributService, private serviceAttribut:AttributService,  private _liveAnnouncer: LiveAnnouncer,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.formeCategorieAttribut = this.formBuilder.group({
        ordreCategorie: ['', [Validators.required, Validators.minLength(1)]],
        nomCategorie: ['', [Validators.required, Validators.minLength(1)]]
      });
    }
    
  ngOnInit(): void {
    console.log(this.data.dataICategorieAffiche)

      this.TABLE_CATEGORIE_AFFICHAGE_TEMP = this.data.dataICategorieAffiche
      this.tableResultatsCategoriesAffichage.data = this.TABLE_CATEGORIE_AFFICHAGE_TEMP;
    if (this.data.dataICategorieAffiche != null && this.data.dataICategorieAffiche.length >0) {
      //Création du premier tableau si le deuxième n'est pas vide
      let listAtt : String[] = [];
      let listCatAtt  = this.tableResultatsCategoriesAffichage.data;
      //recuperation des id des attributs dans le deuxieme tableau de la modal
      listCatAtt.forEach(valeur=>{
        listAtt.push(valeur.attribut.id);
      });
      //comparaison avec les ids du tableau initial pour exclure ce présent dans le second
      this.tableauAttributsTemp = [];
      let tmpTab =  this.data.dataSourceAttributDocument.data;
      tmpTab.forEach(
        (att : IAttributs) =>{
          if(!listAtt.includes(att.id)){
            this.tableauAttributsTemp.push(att);
          }
      });
      this.dataSourceAttributTemp = new MatTableDataSource<IAttributs>(this.tableauAttributsTemp);

      //suppression des valeurs dans le second tableau si les attributs ont été supprimé dans le tableau initial des attributs
      let TABLE_CATEGORIE_AFFICHAGE_TEMP : ICategorieAffichage[] = [];
      listCatAtt.forEach(attCat =>{
        for (let index = 0; index < tmpTab.length; index++) {
          const element = tmpTab[index];
           if(element.id ==attCat.attribut.id ){
            TABLE_CATEGORIE_AFFICHAGE_TEMP.push(attCat);
            break;
          }
        }    
      });
      this.tableResultatsCategoriesAffichage = new MatTableDataSource<ICategorieAffichage>(TABLE_CATEGORIE_AFFICHAGE_TEMP);
      this.tableauIndexSelectionner = new Map;
      //sauvegarde de la nouvelle valeur du 2ème tableau
      this.data.dataICategorieAffiche.data =  TABLE_CATEGORIE_AFFICHAGE_TEMP;
    }else{
      //Création du premier tableau si le deuxième est vide
      this.tableauAttributsTemp = this.data.dataSourceAttributDocument.data
    }
    this.dataSourceAttributTemp.data = this.tableauAttributsTemp;
  }

  /**
   * fonction qui permet d'ajouter des categories au check dans un tableau temporaire
   * avant des les enregistrer dans le deuxieme tableau de la modale
   * @param categorieAttributInput 
   * @param attribut 
   * @param index 
   * @param event 
   * @returns 
   */
  selectionnerCategorieCheck(categorieAttributInput:any,attribut : any, index : number, event: any){
    console.log(this.dataSourceAttributTemp.data);
    console.log(attribut);
    console.log(index);

    this.validation = true
    if(this.formeCategorieAttribut.invalid) return;

    //controle des doublons dans le premier tableau
    let ordreExist : boolean = this.verifierSiOrdreExistePremierTableau(attribut.ordre);
    if(ordreExist){
      alert("interdit doublon d'ordre d'attribut");
      event.target.checked=false;
      return;
    }

    //controle des doublons dans le second tableau
    let ordreAttributExiste : number =  this.verifierSiExisteCategorieAttributOrdre(attribut.ordre, categorieAttributInput.nomCategorie, categorieAttributInput.ordreCategorie);
    if(ordreAttributExiste==1){
      alert("doublon d'ordre d'attribut interdit");
      event.target.checked=false;
      return;
    }
    else if(ordreAttributExiste==2){
      alert("Catégorie avec deux ordres différents interdit");
      event.target.checked=false;
      return;
    }
    else if(ordreAttributExiste==3){
      alert("Catégorie différente avec un ordre existant interdit");
      event.target.checked=false;
      return;
    }

    //si pas de doublon, on sauvegarde l'information cochée
    if (event.target.checked ) {
        const categorieAttributsTemp : ICategorieAffichage ={
          id: uuidv4(),
          nom: categorieAttributInput.nomCategorie,
          ordre: categorieAttributInput.ordreCategorie,
          attribut: attribut
        }
      
      this.tableauIndexSelectionner.set(index,categorieAttributsTemp);
    } else if(!event.target.checked ) {
      this.tableauIndexSelectionner.delete(index);
    }
 }

 /**
  * vérifie que l'ordre de l'attribut nouvelle selectionnée n'existe pas dans le meme tableau
  * @param ordre 
  * @returns 
  */
  verifierSiOrdreExistePremierTableau(ordre : number): boolean{
    
    let tmpTab =  this.tableauIndexSelectionner;
    let ordreAttributExiste = false
    tmpTab.forEach(
      (cat : ICategorieAffichage) =>{
        if (cat.attribut.ordre == ordre) {
          ordreAttributExiste = true
        }
    });
    return ordreAttributExiste
  }

  /**
   * Methode qui permet de vérifier dans le second tableau si chaque catégorie a un ordre distinct
   * et si tous les attributs d'une même catégorie ont des ordres distincts
   * @param ordreAttribut 
   * @param nomCategorie 
   * @param ordreCategorie 
   * @returns 
   */
  verifierSiExisteCategorieAttributOrdre(ordreAttribut : number, nomCategorie : string, ordreCategorie : number) : number{
    let tmpTab =  this.tableResultatsCategoriesAffichage.data;
    let ordreAttributExiste :number = 0;

    for (let index = 0; index < tmpTab.length; index++) {
      const element = tmpTab[index];
      if(element.nom.localeCompare(nomCategorie)==0){
        //si deux attributs de la meme catégorie ont un meme ordre
         if (element.attribut.ordre == ordreAttribut) {
           ordreAttributExiste = 1;
           break;
         }
         //si la même catégorie a un ordre différent
         if(element.ordre != ordreCategorie){
           ordreAttributExiste = 2;
           break;
         }
       }
       else{ //si c'est une nouvelle catégorie dans le tableau  
         if(element.ordre == ordreCategorie){ //si la même catégorie a un ordre différent
           ordreAttributExiste = 3;
           break;
         }
       }
    }
    return ordreAttributExiste
  }

  AjouterCategorieTemp() {
    this.validation = true
    if(this.formeCategorieAttribut.invalid) return;

    //Ajout des valeurs dans le second tableau 

    this.TABLE_CATEGORIE_AFFICHAGE_TEMP=this.tableResultatsCategoriesAffichage.data;
    this.tableauIndexSelectionner.forEach((valeur, cle)=>{
      this.TABLE_CATEGORIE_AFFICHAGE_TEMP.push(valeur);
    });
    this.tableResultatsCategoriesAffichage.data = this.TABLE_CATEGORIE_AFFICHAGE_TEMP;
    this.data.dataICategorieAffiche.data = this.TABLE_CATEGORIE_AFFICHAGE_TEMP;
    
    //récupération des id attributs selectionnés 

    let listAtt : String[] = [];
    let listOrdre : number[] = [];
    this.tableauIndexSelectionner.forEach((valeur, cle)=>{
      listAtt.push(valeur.attribut.id);
      listOrdre.push(valeur.attribut.ordre);
    });

    //construction du tableau résiduel

    this.tableauAttributsTemp = [];
    let tmpTab =  this.dataSourceAttributTemp.data;
    tmpTab.forEach(
      (att : IAttributs) =>{ 
        if(!listAtt.includes(att.id) ){
          this.tableauAttributsTemp.push(att);
        }
    });
    this.dataSourceAttributTemp = new MatTableDataSource<IAttributs>(this.tableauAttributsTemp);
    this.tableauIndexSelectionner = new Map;
  }

  /**
   * methode de suppression des categories deja enregistrees dans le deuxieme tableau
   * @param categorieAffichage 
   * @param index 
   */
  supprimerCategorieAffiche(categorieAffichage : ICategorieAffichage, index : number){

    //suppression des valeurs dans le second tableau 

    this.TABLE_CATEGORIE_AFFICHAGE_TEMP=this.tableResultatsCategoriesAffichage.data;
    this.TABLE_CATEGORIE_AFFICHAGE_TEMP.splice(index, 1);
    this.tableResultatsCategoriesAffichage.data = this.TABLE_CATEGORIE_AFFICHAGE_TEMP;
    this.data.dataICategorieAffiche.data = this.TABLE_CATEGORIE_AFFICHAGE_TEMP;

    //construction du premier tableau
    this.tableauAttributsTemp.push(categorieAffichage.attribut);
    this.dataSourceAttributTemp = new MatTableDataSource<IAttributs>(this.tableauAttributsTemp);
    //suppression dans les index selectionnés
    let indexASupprimer : number  = -1;
    this.tableauIndexSelectionner.forEach((valeur, cle)=>{
      if(valeur.attribut.id==categorieAffichage.attribut.id)
        indexASupprimer = cle;
    });
    if(indexASupprimer>=0)
      this.tableauIndexSelectionner.delete(indexASupprimer);
  }
  
  validerCategorieAttribut(){
    this.categorieAttributs  = {
      id: '',
      nom: '',
      ordre: 0,
      listAttributs: []
    }

    this.tableResultatsCategoriesAffichage.data.forEach(
      categorieAttributsTemp => {
        
        if (categorieAttributsTemp.nom != this.categorieAttributs.nom) {

          this.categorieAttributs  = {
            id: '',
            nom: '',
            ordre: 0,
            listAttributs: []
          }
          this.categorieAttributs.nom = categorieAttributsTemp.nom,
          this.categorieAttributs.ordre = categorieAttributsTemp.ordre,
          this.categorieAttributs.listAttributs.push(categorieAttributsTemp.attribut)
          this.categorieAttributs.id = categorieAttributsTemp.id 
        }
 
      }
    );
  }

  retirerSelectionCategorieAttribut(index: number){
    this.TABLE_CATEGORIE_AFFICHAGE_TEMP.splice(index, 1)
  }

  get f(){
    return this.formeCategorieAttribut.controls;
  }
  private getAllAttributs(){
    return this.serviceAttribut.getAllAttributs();
  }

  ngAfterViewInit() {
    this.dataSourceAttributTemp.paginator = this.paginator;
    this.dataSourceAttributTemp.sort = this.sort;
  }
  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  

  onSubmit(categorieAttributInput:any){

  }
}


