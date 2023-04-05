import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { IDocument } from 'src/app/modele/document';
import { IMission } from 'src/app/modele/mission';
import { DocumentService } from 'src/app/services/documents/document.service';
import { MissionsService } from 'src/app/services/missions/missions.service';

@Component({
  selector: 'app-executer-mission',
  templateUrl: './executer-mission.component.html',
  styleUrls: ['./executer-mission.component.css']
})
export class ExecuterMissionComponent implements OnInit {

  formeMissionExec: FormGroup;
  missions$: Observable<IMission[]> =EMPTY;
  documents: IDocument[]=[];
  aDesDocumentsDispo:boolean=false;
  missionChoisieLibelle: string="";

  constructor(private formBuilder:FormBuilder, private missionService:MissionsService,private router:Router, private infosPath:ActivatedRoute, private documentService:DocumentService ) {
    this.formeMissionExec = this.formBuilder.group({
     
    });
   }

  ngOnInit(): void {
    this.missions$ = this.missionService.getMissionByUser("admin");
  }

  choisirMission(idMission:any,libelleMission:any){
   sessionStorage.setItem("missionChoisie",idMission);
   this.missionChoisieLibelle = libelleMission;
   
   this.documentService.getDocumentByMission(idMission).subscribe(
    docs=>{
      if(docs.length>0){//si des documents retournés on met à jour la présentation
        this.documents = docs;
        this.aDesDocumentsDispo=true;
      }else{
        this.documents = docs;
        this.aDesDocumentsDispo=false;
      }
      
    }
   ); 
  }

  choisirDocument(value:any){
    this.router.navigate(['exemplaire-nouveau/'.concat(value)]);
  }


}
