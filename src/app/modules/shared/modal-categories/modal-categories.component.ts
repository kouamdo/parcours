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

 // myControl = new FormControl<string | IAttributs>('');
  formeCategorieAttribut: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter une categorie";
  submitted: boolean=false;
  validation: boolean=false;
 // ELEMENTS_TABLE_CATEGORIES: IAttributs[] = []; 
  //filteredOptions: IAttributs[] | undefined;
  displayedCategoriesAttributsColumns: string[] = ['actions','nomCategorie', 'ordreCat', 'libelleAttribut', 'ordreAtrParCat']; // structure du tableau presentant les categories creees avec leurs attributs
  displayedCategoriesColumns: string[] = ['actions','titre', 'description', 'type', 'ordreAtrParCat'];  // structure du tableau presentant les choix des attributs lors de la creation des categories
  //idAttribut : string = ""
  //conteur : any = 0
  ordreAttributExiste : boolean = false
  ordreCategorieExiste : boolean = false
  nomValide : boolean = false
  
  // variables pour la gestion des categories
  dataSourceAttributTemp = new MatTableDataSource<IAttributs>(); //tableau de listing des attributs a affecter a chaque categorie
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

  //ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS: ICategoriesAttributs[] = [];

  TABLE_CATEGORIE_AFFICHAGE_TEMP: ICategorieAffichage[] = []; // tableau contenant les categories creees a partir du premier tableau de la modal
 // tableResultatsCategoriesAttributs  = new MatTableDataSource<ICategoriesAttributs>(this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS);
  tableResultatsCategoriesAffichage  = new MatTableDataSource<ICategorieAffichage>(this.TABLE_CATEGORIE_AFFICHAGE_TEMP);
  //tableFinaleCategoriesAttributs: ICategoriesAttributs[] = [];

  tableauAttributsTemp : IAttributs[] = []
  tableauIndexSelectionner = new Map(); 
  //sauvegardeTempAttributsDeCat : ICategorieAffichage[] = [] // tableau de sauvegarde temporaire des attributs des categoriesAffiche enregistrees
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceCategorieAttribut:CategorieAttributService, private serviceAttribut:AttributService,  private _liveAnnouncer: LiveAnnouncer,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.formeCategorieAttribut = this.formBuilder.group({
       // _ordreAttribut: this.formBuilder.array([]),
        ordreCategorie: ['', [Validators.required, Validators.minLength(1)]],
        nomCategorie: ['', [Validators.required, Validators.minLength(1)]]
      });
    }
    
  ngOnInit(): void {
    console.log(this.data.dataICategorieAffiche)
    this.tableauAttributsTemp = this.data.dataSourceAttributDocument.data
    this.dataSourceAttributTemp.data = this.tableauAttributsTemp;

    if (this.data.dataICategorieAffiche != null) {
      this.TABLE_CATEGORIE_AFFICHAGE_TEMP = this.data.dataICategorieAffiche
      this.tableResultatsCategoriesAffichage.data = this.TABLE_CATEGORIE_AFFICHAGE_TEMP;
    }
  }

  ValiderCategorie(categorieAttributInput:any,value : any, index : number, event: any){
    console.log(this.dataSourceAttributTemp.data);
    console.log(value);
    console.log(index);

    this.validation = true
    if(this.formeCategorieAttribut.invalid) return;
    
    if (event.target.checked) {
        const categorieAttributsTemp : ICategorieAffichage ={
          id: uuidv4(),
          nom: categorieAttributInput.nomCategorie,
          ordre: categorieAttributInput.ordreCategorie,
          attribut: value
        }
      
     // this.sauvegardeTempAttributsDeCat[index]= categorieAttributsTemp;
      this.tableauIndexSelectionner.set(index,categorieAttributsTemp);
        
    } else {
      this.tableauIndexSelectionner.delete(index);
     // this.sauvegardeTempAttributsDeCat.splice(index, 1)
    }
 }
  verifierSiExiste(attributDeCategorie : IAttributs): boolean{
    let listAtt : String[] = [];
    this.tableauIndexSelectionner.forEach((valeur, cle)=>{
      listAtt.push(valeur.attribut.id);
    });
    this.tableauAttributsTemp = [];
    let tmpTab =  this.dataSourceAttributTemp.data;
    tmpTab.forEach(
      (att : IAttributs) =>{
        this.ordreAttributExiste = false
        if (listAtt.includes(attributDeCategorie.ordre.toString())) {
          this.ordreAttributExiste = true
        }
    });
    return this.ordreAttributExiste
  }

  AjouterCategorieTemp() {
    this.validation = true
    if(this.formeCategorieAttribut.invalid) return;

    //Ajout des valeurs dans le second tableau 

    this.TABLE_CATEGORIE_AFFICHAGE_TEMP=this.tableResultatsCategoriesAffichage.data;
    this.tableauIndexSelectionner.forEach((valeur, cle)=>{
      this.TABLE_CATEGORIE_AFFICHAGE_TEMP.push(valeur);
    });
    this.tableResultatsCategoriesAffichage.data =  this.TABLE_CATEGORIE_AFFICHAGE_TEMP;
    
    //récupération des id attributs selectionnés 

    let listAtt : String[] = [];
    this.tableauIndexSelectionner.forEach((valeur, cle)=>{
      listAtt.push(valeur.attribut.id);
    });

    //construction du tableau résiduel

    this.tableauAttributsTemp = [];
    let tmpTab =  this.dataSourceAttributTemp.data;
    tmpTab.forEach(
      (att : IAttributs) =>{
        if(!listAtt.includes(att.id)){
          this.tableauAttributsTemp.push(att);
        }
        // if (listAtt.includes(att.ordre.toString())) {
        //   this.ordreAttributExiste = true
        //   return
        // }
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

 /* displayFn(attribue: IAttributs): string {
    return attribue && attribue.titre ? attribue.titre : '';
  }*/

  ngAfterViewInit() {
    this.dataSourceAttributTemp.paginator = this.paginator;
    this.dataSourceAttributTemp.sort = this.sort;
  }

 /* public rechercherListingAttribut(option: IAttributs){
    this.serviceAttribut.getAttributsByTitre(option.titre.toLowerCase()).subscribe(
        valeurs => {this.dataSourceAttributTemp.data = valeurs;}
    )
  }*/
  
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


