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
    // this.tableauAttributsTemp = this.data.dataSourceAttributDocument.data
    // this.dataSourceAttributTemp.data = this.tableauAttributsTemp;

      this.TABLE_CATEGORIE_AFFICHAGE_TEMP = this.data.dataICategorieAffiche
      this.tableResultatsCategoriesAffichage.data = this.TABLE_CATEGORIE_AFFICHAGE_TEMP;
    if (this.data.dataICategorieAffiche != null) {

      let listAtt : String[] = [];
      this.tableauIndexSelectionner.forEach((valeur, cle)=>{
        listAtt.push(valeur.attribut.id);
      });
    
      this.tableauAttributsTemp = [];
      let tmpTab =  this.data.dataSourceAttributDocument.data;
      tmpTab.forEach(
        (att : IAttributs) =>{
          if(!listAtt.includes(att.id) && !this.verifierSiExiste(att.ordre)){
            this.tableauAttributsTemp.push(att);
          }
      });
      this.dataSourceAttributTemp = new MatTableDataSource<IAttributs>(this.tableauAttributsTemp);
      this.tableauIndexSelectionner = new Map;
    }else{

      this.tableauAttributsTemp = this.data.dataSourceAttributDocument.data
    }
      this.dataSourceAttributTemp.data = this.tableauAttributsTemp;
  }

  validerCategorie(categorieAttributInput:any,value : any, index : number, event: any){
    console.log(this.dataSourceAttributTemp.data);
    console.log(value);
    console.log(index);

    this.validation = true
    if(this.formeCategorieAttribut.invalid) return;
    /**
     * il est préférable d'appeler vérifierSiExiste au besoin car il faut travailler avec l'ordre courant
     * si besoin de réutiliser une variable dans ce cas alors tu la déclares en local 
     *  let ordreAttributExiste : boolean = this.verifierSiExiste(value.ordre)
     */
//&& ordreAttributExiste == false
    if (event.target.checked ) {
        const categorieAttributsTemp : ICategorieAffichage ={
          id: uuidv4(),
          nom: categorieAttributInput.nomCategorie,
          ordre: categorieAttributInput.ordreCategorie,
          attribut: value
        }
      
      this.tableauIndexSelectionner.set(index,categorieAttributsTemp);
//&& this.ordreAttributExiste == true
    } else if(!event.target.checked ) {
      this.tableauIndexSelectionner.delete(index);
    }
 }
  verifierSiExiste(ordre : any): boolean{
    
    let tmpTab =  this.tableResultatsCategoriesAffichage.data;
    let ordreAttributExiste = false
    tmpTab.forEach(
      (cat : ICategorieAffichage) =>{
        if (cat.attribut.ordre == ordre) {
          ordreAttributExiste = true
        }
    });
    return ordreAttributExiste
  }

  AjouterCategorieTemp() {
    this.validation = true
    if(this.formeCategorieAttribut.invalid) return;

    //Ajout des valeurs dans le second tableau 

    this.TABLE_CATEGORIE_AFFICHAGE_TEMP=this.tableResultatsCategoriesAffichage.data;
    this.tableauIndexSelectionner.forEach((valeur, cle)=>{
     //inutile controle déjà fait sur le clic du checkbox 
     //en plus ici tu ne controles pas l'ordre courant donc si le dernier controlé a déjà un autre les prochains ne marcheront pas
      // if(this.ordreAttributExiste == true) return;
      this.TABLE_CATEGORIE_AFFICHAGE_TEMP.push(valeur);
    });
    this.tableResultatsCategoriesAffichage.data =  this.TABLE_CATEGORIE_AFFICHAGE_TEMP;
    
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
      (att : IAttributs) =>{ //&& this.ordreAttributExiste == false 
        if(!listAtt.includes(att.id) ){
          this.tableauAttributsTemp.push(att);
        }
    });
    this.dataSourceAttributTemp = new MatTableDataSource<IAttributs>(this.tableauAttributsTemp);
    this.tableauIndexSelectionner = new Map;
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


