import { LiveAnnouncer } from '@angular/cdk/a11y';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, EMPTY } from 'rxjs';
import { IAttributs } from 'src/app/modele/attributs';
import { IDocument } from 'src/app/modele/document';
import { IMission } from 'src/app/modele/mission';
import { AttributService } from 'src/app/services/attributs/attribut.service';
import { DocumentService } from 'src/app/services/documents/document.service';
import { MissionsService } from 'src/app/services/missions/missions.service';

@Component({
  selector: 'app-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss']
})
export class DocumentComponent implements OnInit {
  
  document : IDocument|undefined;
  missionData : IMission[] | undefined;
  mission$:Observable<IMission[]>=EMPTY;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouveau document";
  submitted: boolean=false;
  idMission : string = "";
  idAttribut : string = "";

  // variables attributs, pour afficher le tableau d'attributs sur l'IHM
  myControl = new FormControl<string | IAttributs>('');
  ELEMENTS_TABLE: IAttributs[] = [];
  filteredOptions: IAttributs[] | undefined;
  displayedColumns: string[] = ['actions','titre', 'description', 'type'];
  dataSourceAttribut = new MatTableDataSource<IAttributs>(this.ELEMENTS_TABLE);
  dataSourceAttributResultat = new MatTableDataSource<IAttributs>();
  @ViewChild(MatPaginator)
  paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  _attributs :  FormArray | undefined;

  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceMission:MissionsService, private serviceAttribut:AttributService,  private _liveAnnouncer: LiveAnnouncer) {
    this.forme = this.formBuilder.group({
      _missions :  new FormArray([]),
      _attributs :  new FormArray([]),
      titre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      description: [''],
      missions: [],
      attributs: []
    });
  }
  ngOnInit(): void {
    this.mission$ = this.getAllMissions();
    this.getAllAttributs().subscribe(valeurs => {
      this.dataSourceAttribut.data = valeurs;
    });

    let IdDocument = this.infosPath.snapshot.paramMap.get('IdDocument');
    if((IdDocument != null) && IdDocument!==''){
      this.btnLibelle="Modifier";
      this.titre="Document à Modifier";
      this.serviceDocument.getDocumentById(IdDocument).subscribe(x =>
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
    } else {
      const index = _missions.controls
      .findIndex(x => x.value === event.target.value);
      _missions.removeAt(index);
    }
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

  ajoutSelectionAttribut(idAttribut: string) {
    console.log('attribut :' + idAttribut);
    this.serviceAttribut.getAttributById(idAttribut).subscribe(
      val => {
        console.log('Iattribut :' + val.id);
        this.ELEMENTS_TABLE = this.dataSourceAttributResultat.data;
        this.ELEMENTS_TABLE.push(val);
        this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE;
      }
    )    
  }

  retirerSelectionAttribut(index: number) {
    const _attributs = (this.forme.controls['_attributs'] as FormArray);
    this.ELEMENTS_TABLE = this.dataSourceAttributResultat.data;
    this.ELEMENTS_TABLE.splice(index, 1); // je supprime un seul element du tableau a la position 'index'
    _attributs.removeAt(index);
    this.dataSourceAttributResultat.data = this.ELEMENTS_TABLE;
  }

  onSubmit(documentInput:any){
    this.submitted=true;
    if(this.forme.invalid) return;
    let documentTemp : IDocument={
      id: String(9),
      titre:documentInput.titre,
      description:documentInput.description,
      missions:documentInput.missions,
      attributs:documentInput.attributs
    }
    if(this.document != undefined){
      documentTemp.id = this.document.id  
    }
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
