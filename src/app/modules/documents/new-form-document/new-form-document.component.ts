import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { IAfficheDocument } from 'src/app/modele/affiche-document';
import { IAttributs } from 'src/app/modele/attributs';
import { IDocument } from 'src/app/modele/document';
import { IMission } from 'src/app/modele/mission';
import { IService } from 'src/app/modele/service';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { DocumentService } from 'src/app/services/documents/document.service';
import { MissionsService } from 'src/app/services/missions/missions.service';

@Component({
  selector: 'app-new-form-document',
  templateUrl: './new-form-document.component.html',
  styleUrls: ['./new-form-document.component.scss']
})
export class NewFormDocumentComponent implements OnInit {
  
  document : IDocument|undefined;
  mission$:Observable<IMission[]>=EMPTY;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouveau document";
  submitted: boolean=false;
  idMission : string = "";
  idAttribut : string = "";
  serviceDeMission!: IService;

  afficheDocument : IAfficheDocument = {
    id: '',
    titre: '',
    description: '',
    missions: [],
    attributs: [],
    listeMissions: '',
    listAttributs: '',
    categories: []
  }

  // variables attributs, pour afficher le tableau d'attributs sur l'IHM
  myControl = new FormControl<string | IAttributs>('');
  ELEMENTS_TABLE_ATTRIBUTS: IAttributs[] = [];
  filteredOptions: IAttributs[] | undefined;
  displayedAttributsColumns: string[] = ['actions','titre', 'description', 'type'];
  displayedCategorieAttributColumns: string[] = ['actions','titre', 'description', 'type', 'ordre'];
  dataSourceAttribut = new MatTableDataSource<IAttributs>(this.ELEMENTS_TABLE_ATTRIBUTS);
  dataSourceAttributResultat = new MatTableDataSource<IAttributs>();
  _attributs :  FormArray | undefined;

  dataMission : IMission[] = [];
  dataSourceMissionResultat = new MatTableDataSource<IMission>();
  _missions :  FormArray | undefined;
  ELEMENTS_TABLE_CATEGORIES: IAttributs[] = []; //tableau de listing des attributs a affecter a chaque categorie

  dataSourceCategorieAttribut = new MatTableDataSource<IAttributs>(this.ELEMENTS_TABLE_CATEGORIES);
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceMission:MissionsService, private serviceAttribut:AttributService,  private _liveAnnouncer: LiveAnnouncer) {
    this.forme = this.formBuilder.group({
      _missions :  new FormArray([]),
      _attributs :  new FormArray([]),
      titre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: [''],
      ordreCategorie: [''],
      missions: [],
      attributs: [],
      categories: []
    });
  }
  ngOnInit(): void {
    this.mission$ = this.getAllMissions();
    this.getAllAttributs().subscribe(valeurs => {
      this.dataSourceAttribut.data = valeurs;
    });

    let idDocument = this.infosPath.snapshot.paramMap.get('idDocument');
    if((idDocument != null) && idDocument!==''){
      this.btnLibelle="Modifier";
      this.titre="Document à Modifier";
      this.serviceDocument.getDocumentById(idDocument).subscribe(x =>
      {
        this.document = x; console.log(this.document);
        this.forme.setValue({
          titre: this.document.titre,
          description: this.document.description,
          missions: this.document.missions,
          attributs: this.document.attributs
        })   
      });
    }
    this.getAllAttributs()
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

  onCheckMissionChange(event: any) {
    const _missions = (this.forme.controls['_missions'] as FormArray);
    if (event.target.checked) {
      _missions.push(new FormControl(event.target.value));
      this.ajoutSelectionMission(event.target.value);
      
    } else {
      const index = _missions.controls
      .findIndex(x => x.value === event.target.value);
      //this.retirerSelectionMission(index)
      _missions.removeAt(index);
      this.dataMission.splice(index,1);
    }
      this._missions = _missions;
      console.log(this._missions.value);
  }
  //TODO mise en cache
  ajoutSelectionMission(value: any) {
    this.serviceMission.getMissionById(value).subscribe(
      object => {
        this.dataMission.push(object);
      }
    )
  }
  onCheckAttributChange(event: any) {
    const _attributs = (this.forme.controls['_attributs'] as FormArray);
    if (event.target.checked) {
      _attributs.push(new FormControl(event.target.value));
      this.ajoutSelectionAttribut(this.idAttribut);
    } else {
      const index = _attributs.controls
      .findIndex(x => x.value === event.target.value);
      this.retirerSelectionAttribut(index)
      _attributs.removeAt(index);
    }
    this._attributs = _attributs
  }

  getAttributId(idAttribut: string) {
    this.idAttribut = idAttribut
  }
  getMissionId(idMission: string) {
    this.idMission = idMission
  }

  ajoutSelectionAttribut(idAttribut: string) {
    this.serviceAttribut.getAttributById(idAttribut).subscribe(
      val => {
        console.log('IdAttribut :' + val.id);
        this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
        this.dataSourceAttributResultat.data = this.dataSourceCategorieAttribut.data
        this.ELEMENTS_TABLE_ATTRIBUTS.push(val);
        this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
       // this.ELEMENTS_TABLE_CATEGORIES = this.ELEMENTS_TABLE_ATTRIBUTS;
        this.dataSourceCategorieAttribut.data = this.ELEMENTS_TABLE_ATTRIBUTS
      }
    )    
  }

  retirerSelectionAttribut(index: number) {
    const _attributs = (this.forme.controls['_attributs'] as FormArray);
    this.ELEMENTS_TABLE_ATTRIBUTS = this.dataSourceAttributResultat.data;
    this.ELEMENTS_TABLE_ATTRIBUTS.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    _attributs.removeAt(index);
    this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE_ATTRIBUTS;
  }

  onSubmit(documentInput:any){
//    const _missionsSelected = (this.forme.get('_missions') as FormArray);
    this.submitted=true;
    if(this.forme.invalid) return;
    let documentTemp : IDocument={
      id: String(9),
      titre: documentInput.titre,
      description: documentInput.description,
      missions: [],
      attributs: [],
      categories: []
    }
    //Faire un appel synchrone
    /*_missionsSelected.value.forEach((element: any) => {
      console.log("_missionsSelected est : " ,element);
      this.serviceMission.getMissionById(element).subscribe(
        object => {
          documentTemp.missions.push(object);
        }
      )
    });*/
    documentTemp.missions = this.dataMission;
    
    this.dataSourceAttributResultat.data.forEach(
      a => documentTemp.attributs.push(a)
    )
    this.serviceDocument.ajouterDocument(documentTemp).subscribe(
      object => {
        this.router.navigate(['/list-documents']);
      }
    )
  }
  get f(){
    return this.forme.controls;
  }
  private getAllMissions(){
    return this.serviceMission.getAllMissions();
  }
  private getAllAttributs(){
    return this.serviceAttribut.getAllAttributs();
  }
  displayFn(attribue: IAttributs): string {
    return attribue && attribue.titre ? attribue.titre : '';
  }

  ngAfterViewInit() {
    this.dataSourceAttribut.paginator = this.paginator;
    this.dataSourceAttribut.sort = this.sort;
  }

  public rechercherListingAttribut(option: IAttributs){
    this.serviceAttribut.getAttributsByTitre(option.titre.toLowerCase()).subscribe(
        valeurs => {this.dataSourceAttribut.data = valeurs;}
    )
  }
  
  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this._liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this._liveAnnouncer.announce('Sorting cleared');
    }
  }
}

