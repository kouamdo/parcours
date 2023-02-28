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
import { TypeTicket } from 'src/app/modele/type-ticket';
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
  AttributData : Observable<IAttributs[]>=EMPTY;
  mission$:Observable<IMission[]>=EMPTY;
  attrubut$:Observable<IAttributs[]>=EMPTY;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouveau document";
  submitted: boolean=false;
  idMission : string = "";
  idAttribut : string = "";
  // variables attributs, pour afficher le tableau d'attributs sur l'IHM
  attrubuts$:Observable<IAttributs>=EMPTY;
  typeInt = TypeTicket.Int;
  typeString = TypeTicket.String;
  typeDouble = TypeTicket.Double;
  typeFloat = TypeTicket.Float;
  typeBoolean = TypeTicket.Boolean;
  typeDate = TypeTicket.Date;
  myControl = new FormControl<string | IAttributs>('');
  ELEMENTS_TABLE: IAttributs[] = [];
  filteredOptions: IAttributs[] | undefined;
  displayedColumns: string[] = ['titre', 'description', 'type', 'actions'];
  dataSource = new MatTableDataSource<IAttributs>(this.ELEMENTS_TABLE);
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
      missions: ['', Validators.required],
      attributs: ['', Validators.required]
    });
  }
  ngOnInit(): void {
    this.mission$ = this.getAllMissions();
    this.attrubut$ = this.getAllAttributs();
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
    } else {
      const index = _attributs.controls
      .findIndex(x => x.value === event.target.value);
      _attributs.removeAt(index);
    }
    this._attributs = _attributs  
  }
  getAttributId(idAttribut: string) {
    this.idAttribut = idAttribut
  }
  addSelectedAttribut(idAttribut: string) {
    this.AttributData.subscribe(
      value=>{
        //value.push(this.serviceAttribut.getAttributById(this.idAttribut));  
      }
    )
    this.idAttribut = idAttribut
  }
  removeSelectedAttribut(idAttribut: string) {
    this.idAttribut = idAttribut
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
  private getAllDocuments(){
    return this.serviceDocument.getAllDocuments();
  }
  private getAllMissions(){
    return this.serviceMission.getAllMissions();
  }
  private getAllAttributs(){
    return this.serviceAttribut.getAllAttributs();
  }
  private getListAttributs(){
    return this.forme.controls['_attributs'] as FormArray;
  }
  displayFn(attribue: IAttributs): string {
    return attribue && attribue.titre ? attribue.titre : '';
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  public rechercherListingAttribut(option: IAttributs){
    this.serviceAttribut.getAttributsByTitre(option.titre.toLowerCase()).subscribe(
        valeurs => {this.dataSource.data = valeurs;}
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
