import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
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
  AttributData : IAttributs[] | undefined;
  mission$:Observable<IMission[]>=EMPTY;
  attrubut$:Observable<IAttributs[]>=EMPTY;
  forme: FormGroup;
  btnLibelle: string="Ajouter";
  titre: string="Ajouter un nouveau document";
  submitted: boolean=false;
  idMission : string = "";
  idAttribut : string = "";


  constructor(private router:Router, private formBuilder: FormBuilder, private infosPath:ActivatedRoute, private serviceDocument:DocumentService, private serviceMission:MissionsService, private serviceAttribut:AttributService) {
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
  }
  getAttributId(idAttribut: string) {
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
}
