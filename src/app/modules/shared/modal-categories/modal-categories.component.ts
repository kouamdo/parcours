import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { IAttributs } from 'src/app/modele/attributs';
import { ICategoriesAttributs } from 'src/app/modele/categories-attributs';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { CategorieAttributService } from 'src/app/services/categorie-attribut/categorie-attribut.service';
import { DocumentService } from 'src/app/services/documents/document.service';

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
  ELEMENTS_TABLE_CATEGORIES: IAttributs[] = []; //tableau de listing des attributs a affecter a chaque categorie
  filteredOptions: IAttributs[] | undefined;
  displayedCategoriesAttributsColumns: string[] = ['actions','nomCategorie', 'libelleAttribut', 'ordreAtrParCat', 'ordreCat']; // structure du tableau presentant les categories creees avec leurs attributs
  displayedCategoriesColumns: string[] = ['actions','titre', 'description', 'type', 'ordreAtrParCat'];  // structure du tableau presentant les choix des attributs lors de la creation des categories
  idAttribut : string = ""
  
  // variables pour la gestion des categories
  dataSourceCategorieAttribut = new MatTableDataSource<IAttributs>(this.ELEMENTS_TABLE_CATEGORIES);
  categorieAttributs : ICategoriesAttributs = {
    id: '',
    nom: '',
    ordre: 0,
    listAttributs: []
  }
  ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS: ICategoriesAttributs[] = [];
  tableResultatsCategoriesAttributs  = new MatTableDataSource<ICategoriesAttributs>(this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS);
  tableFinaleCategoriesAttributs: ICategoriesAttributs[] = [];
  
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor( private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceCategorieAttribut:CategorieAttributService, private serviceAttribut:AttributService,  private _liveAnnouncer: LiveAnnouncer,
    @Inject(MAT_DIALOG_DATA) public data: any) { 
      this.formeCategorieAttribut = this.formBuilder.group({
        _ordreAttribut: this.formBuilder.array([
        ]),
        //ordreAttribut: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],

        ordreCategorie: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]],
        nomCategorie: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(50)]]
      });
    }

  ngOnInit(): void {
    console.log(this.data.name)
    console.log(this.data.dataSourceCategorieAttribut.data)
    this.dataSourceCategorieAttribut = this.data.dataSourceCategorieAttribut
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
    this.categorieAttributs  = {
      id: '',
      nom: '',
      ordre: 0,
      listAttributs: []
    }

    this.validation = true
    if(this.formeCategorieAttribut.invalid) return;
    
    this.categorieAttributs  = {
      id: '9'+ index,
      nom: categorieAttributInput.nomCategorie,
      ordre: categorieAttributInput.ordreCategorie,
      listAttributs: []
    }
    if (event.target.checked) {
      const _ordreAttribut = (this.formeCategorieAttribut.controls['_ordreAttribut'] as FormArray);
      this.serviceAttribut.getAttributById(this.idAttribut).subscribe(
        objet => {
          objet.ordre = _ordreAttribut.value
          this.categorieAttributs.listAttributs.push(objet)
        }
      )
      this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS.push(this.categorieAttributs)
      console.log(this.categorieAttributs)
      
    } else {
      this.retirerSelectionCategorieAttribut(index)
    }
    console.log( 'Voici le tableau avant validation : ' , this.tableResultatsCategoriesAttributs.data)
  }

  retirerSelectionCategorieAttribut(index: number){
    this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS.splice(index, 1)
  }

  ajoutInputOrdre() {
    this._ordreAttribut.push(this.formBuilder.control(''));
  }
  get _ordreAttribut() {
    return this.formeCategorieAttribut.get('_ordreAttribut') as FormArray;
  }

  creerCategorie(){
    this.dataSourceCategorieAttribut.data = this.data.dataSourceCategorieAttribut.data
    this.dataSourceCategorieAttribut.data.forEach(
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
    this.dataSourceCategorieAttribut.paginator = this.paginator;
    this.dataSourceCategorieAttribut.sort = this.sort;
  }

  public rechercherListingAttribut(option: IAttributs){
    this.serviceAttribut.getAttributsByTitre(option.titre.toLowerCase()).subscribe(
        valeurs => {this.dataSourceCategorieAttribut.data = valeurs;}
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

  ok() {
    this.tableResultatsCategoriesAttributs.data = this.ELEMENTS_TABLE_CATEGORIE_ATTRIBUTS
  }
  onSubmit(categorieAttributInput:any){

  }
}


