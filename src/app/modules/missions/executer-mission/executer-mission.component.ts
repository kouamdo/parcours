import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { IDocument } from 'src/app/modele/document';
import { IMission } from 'src/app/modele/mission';
import { DocumentService } from 'src/app/services/documents/document.service';
import { MissionsService } from 'src/app/services/missions/missions.service';
import { ModalChoixSousExemplairesComponent } from '../../shared/modal-choix-sous-exemplaires/modal-choix-sous-exemplaires.component';
import { MatDialog } from '@angular/material/dialog';
import { IPatient } from 'src/app/modele/Patient';
import { ModalChoixPersonneComponent } from '../../shared/modal-choix-personne/modal-choix-personne.component';
import { DonneesEchangeService } from 'src/app/services/donnees-echange/donnees-echange.service';
import { log } from 'console';

@Component({
  selector: 'app-executer-mission',
  templateUrl: './executer-mission.component.html',
  styleUrls: ['./executer-mission.component.scss']
})
export class ExecuterMissionComponent implements OnInit {

  formeMissionExec: FormGroup;
  missions$: Observable<IMission[]> =EMPTY;
  documents: IDocument[]=[];
  aDesDocumentsDispo:boolean=false;
  missionChoisieLibelle: string="";
  estClique : boolean = false;
  idDocumentPourExemplaire : string = ""
  laPersonneRattachee : IPatient | undefined
  document: IDocument | undefined;

  constructor(private formBuilder:FormBuilder, private missionService:MissionsService,private router:Router, private infosPath:ActivatedRoute,
     private documentService:DocumentService,
     private donneeEchangeService:DonneesEchangeService, private dialogDef : MatDialog ) {
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

  getDocument(valeur: IDocument){
    this.idDocumentPourExemplaire = valeur.idDocument
    this.document = valeur
    sessionStorage.setItem("idDocumentPourExemplaire", this.idDocumentPourExemplaire);
  }

  /**
   * Methode permettant d'ouvrir la modal permettant d'associer un bénéficiaire au document qu'on veut creer
   */
  openSousExemplaireDocumentDialog(){
    
    if (this.document?.beneficiaireObligatoire == true) {
      console.log('this.document?.beneficiaireObligatoire', this.document?.beneficiaireObligatoire);
      const dialogRef = this.dialogDef.open(ModalChoixPersonneComponent, 
      {
        maxWidth: '100vw',
        maxHeight: '100vh',
        width:'100%',
        height:'100%',
        enterAnimationDuration:'1000ms',
        exitAnimationDuration:'1000ms',
        data: this.idDocumentPourExemplaire
      })
    }else{
      this.router.navigate(['exemplaire-nouveau/'.concat(this.idDocumentPourExemplaire)])
    }
  }
}
