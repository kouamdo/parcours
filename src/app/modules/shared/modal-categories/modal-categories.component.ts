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

@Component({
  selector: 'app-modal-categories',
  templateUrl: './modal-categories.component.html',
  styleUrls: ['./modal-categories.component.scss']
})
export class ModalCategoriesComponent implements OnInit {

  myControl = new FormControl<string | IAttributs>('');
  formeCategorieAttribut: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter une categorie";
  submitted: boolean=false;
  validation: boolean=false;
 // ELEMENTS_TABLE_CATEGORIES: IAttributs[] = []; 
  filteredOptions: IAttributs[] | undefined;
  displayedCategoriesAttributsColumns: string[] = ['actions','nomCategorie', 'ordreCat', 'libelleAttribut', 'ordreAtrParCat']; // structure du tableau presentant les categories creees avec leurs attributs
  displayedCategoriesColumns: string[] = ['actions','titre', 'description', 'type', 'ordreAtrParCat'];  // structure du tableau presentant les choix des attributs lors de la creation des categories
  idAttribut : string = ""
  conteur : any = 0
  
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

  ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS: ICategoriesAttributs[] = [];

  TABLE_CATEGORIE_AFFICHAGE_TEMP: ICategorieAffichage[] = []; // tableau contenant les categories creees a partir du premier tableau de la modal
  tableResultatsCategoriesAttributs  = new MatTableDataSource<ICategoriesAttributs>(this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS);
  tableResultatsCategoriesAffichage  = new MatTableDataSource<ICategorieAffichage>(this.TABLE_CATEGORIE_AFFICHAGE_TEMP);
  //tableFinaleCategoriesAttributs: ICategoriesAttributs[] = [];

  tableauAttributsTemp : IAttributs[] = []
  tableauIntermediaireAttributsTemp : IAttributs[] = []
  sauvegardeTempAttributsDeCat : IAttributs[] = [] // tableau de sauvegarde temporaire des attributs des categoriesAffiche enregistrees
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceCategorieAttribut:CategorieAttributService, private serviceAttribut:AttributService,  private _liveAnnouncer: LiveAnnouncer,
    @Inject(MAT_DIALOG_DATA) public data: any) {

      this.formeCategorieAttribut = this.formBuilder.group({
        _ordreAttribut: this.formBuilder.array([
        ]),
        ordreCategorie: ['', [Validators.required, Validators.minLength(1)]],
        nomCategorie: ['', [Validators.required, Validators.minLength(1)]]
      });
    }
    
  ngOnInit(): void {
    console.log(this.data.name)
    
    this.dataSourceAttributTemp.data = this.data.dataSourceAttributDocument.data
    this.tableauAttributsTemp = this.dataSourceAttributTemp.data
    
    this.getAllAttributs()
    this.creerCategorie()
    this.myControl.valueChanges.subscribe(
      value => {
        const titre = typeof value === 'string' ? value : value?.titre;
        if(titre != undefined && titre?.length >0){
          this.serviceAttribut.getAttributsByTitre(titre.toLowerCase() as string).subscribe(
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

  getIdAttribut(idAttribut : string){
    this.idAttribut = idAttribut
  }

  ValiderCategorie(categorieAttributInput:any, index : number, event: any){

    this.validation = true
    if(this.formeCategorieAttribut.invalid) return;
    
    if (event.target.checked) {
      const _ordreAttribut = (this.formeCategorieAttribut.controls['_ordreAttribut'] as FormArray);

      this.serviceAttribut.getAttributById(this.idAttribut).subscribe(
        objet => {
          this.attributTemp = objet
          this.attributTemp.ordre = _ordreAttribut.value[index]

        const categorieAttributsTemp : ICategorieAffichage ={
          id: uuidv4(),
          nom: categorieAttributInput.nomCategorie,
          ordre: categorieAttributInput.ordreCategorie,
          attribut: this.attributTemp
        }

      this.TABLE_CATEGORIE_AFFICHAGE_TEMP.push(categorieAttributsTemp)
      this.sauvegardeTempAttributsDeCat.push(categorieAttributsTemp.attribut)
      
      console.log("categorieAttributsTemp :  ", categorieAttributsTemp)
        }
      )
      
    } else {
      this.retirerSelectionCategorieAttribut(index)
      this.sauvegardeTempAttributsDeCat.splice(index, 1)
    }

    console.log( 'Voici le tableau avant validation : ' , this.tableResultatsCategoriesAttributs.data)
    console.log( 'Voici le second tableau avant validation : ' , this.tableResultatsCategoriesAffichage.data)
  }
  
  AjouterCategorieTemp() {

    this.tableauAttributsTemp.forEach(
      (element: IAttributs) => {

        this.TABLE_CATEGORIE_AFFICHAGE_TEMP.forEach(
          categorieAttributAff => {
            if (element.titre == categorieAttributAff.attribut.titre) {
              
              const index = this.tableauAttributsTemp.indexOf(element)

              this.tableauAttributsTemp.splice(index, 1)

              console.log("reduction du tableau initial d'attribut", this.tableauAttributsTemp)
            }
        });
    });
    this.dataSourceAttributTemp.data = this.tableauAttributsTemp
    this.tableResultatsCategoriesAffichage.data = this.TABLE_CATEGORIE_AFFICHAGE_TEMP
    this.creerCategorie()
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

            this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS.forEach(
              element => {
                if (categorieAttributsTemp.nom == element.nom) {
                    element.listAttributs.push(categorieAttributsTemp.attribut)
                }
            });

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
              this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS.push(this.categorieAttributs)
            }
 
      }
    );
      console.log('liste des catAttr finaux : ', this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS)
  }

  retirerSelectionCategorieAttribut(index: number){
    this.TABLE_CATEGORIE_AFFICHAGE_TEMP.splice(index, 1)
  }

  ajoutInputOrdre() {
    this._ordreAttribut.push(this.formBuilder.control(''));
  }
  get _ordreAttribut() {
    return this.formeCategorieAttribut.get('_ordreAttribut') as FormArray;
  }

  creerCategorie(){
    this.dataSourceAttributTemp.data = this.data.dataSourceAttributDocument.data
    this.dataSourceAttributTemp.data.forEach(
      attribut => {
        this.ajoutInputOrdre()
    });
  }

  get f(){
    return this.formeCategorieAttribut.controls;
  }
  private getAllAttributs(){
    return this.serviceAttribut.getAllAttributs();
  }
  displayFn(attribue: IAttributs): string {
    return attribue && attribue.titre ? attribue.titre : '';
  }

  ngAfterViewInit() {
    this.dataSourceAttributTemp.paginator = this.paginator;
    this.dataSourceAttributTemp.sort = this.sort;
  }

  public rechercherListingAttribut(option: IAttributs){
    this.serviceAttribut.getAttributsByTitre(option.titre.toLowerCase()).subscribe(
        valeurs => {this.dataSourceAttributTemp.data = valeurs;}
    )
  }
  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
  
  retirerSelectionAttribut(index : number) {
    
  }

  onSubmit(categorieAttributInput:any){

  }
}


